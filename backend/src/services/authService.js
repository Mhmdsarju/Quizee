import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { genarateToken } from "../utils/genarateToken.js";
import OTP from "../models/otpModel.js";
import { genarateOtp } from "../utils/OtpHelper.js";
import { sendOTPEmail } from "../utils/emailService.js";

const MAX_ATTEMPTS = 5;

const signup = async ({ name, email, password, referredBy }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const exists = await userModel.findOne({ email });
  if (exists) {
    throw new Error("User already exists");
  }
  await OTP.deleteMany({ email, purpose: "signup" });
  const otp = genarateOtp();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.create({
    email,
    otp: otpHash,
    purpose: "signup",
    attempts: 0,
    data: {
      name,
      password, 
      referredBy: referredBy || null,
    },
  });

  await sendOTPEmail(email, otp);

  return { message: "OTP sent to your email" };
};

const verifyOtp = async ({ email, otp, purpose }) => {
  if (!email || !otp || !purpose) {
    throw new Error("Email, OTP and purpose required");
  }

  const record = await OTP.findOne({ email, purpose });
  if (!record) throw new Error("OTP expired or invalid");

  if (record.attempts >= MAX_ATTEMPTS) {
    await OTP.deleteOne({ _id: record._id });
    throw new Error("Too many attempts. Please resend OTP");
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  if (otpHash !== record.otp) {
    record.attempts += 1;
    await record.save();
    throw new Error("Invalid OTP");
  }

  let user;
  if (purpose === "signup") {
    const { name, password, referredBy } = record.data || {};
    if (!name || !password) {
      throw new Error("Signup data missing");
    }

    const hash = await bcrypt.hash(password, 10);

    user = await userModel.create({
      name,
      email,
      password: hash,
      role: "user",
      referredBy,
      isVerified: true,
    });
  }
  if (purpose === "email-change") {
    if (!record.data?.userId) throw new Error("Unauthorized");

    user = await userModel.findById(record.data.userId);
    if (!user) throw new Error("User not found");

    user.email = email;
    await user.save();
  }

  await OTP.deleteOne({ _id: record._id });

  const tokens = genarateToken(user);

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const resendOtp = async ({ email, purpose }) => {
  if (!email || !purpose) {
    throw new Error("Email and purpose required");
  }

  const existing = await OTP.findOne({ email, purpose });
  if (!existing) throw new Error("OTP expired, please signup again");

  await OTP.deleteMany({ email, purpose });

  const otp = genarateOtp();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.create({
    email,
    otp: otpHash,
    purpose,
    attempts: 0,
    data: existing.data,
  });

  await sendOTPEmail(email, otp);

  return { message: "OTP resent successfully" };
};

const login = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email and password required");

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");
  if (!user.isVerified) throw new Error("Verify email first");
  if (user.isBlocked) {
  const err = new Error("Account blocked");
  err.code = "ACCOUNT_BLOCKED";
  throw err;
}


  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const tokens = genarateToken(user);

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const refresh = async (token) => {
  if (!token) throw new Error("No refresh token");

  const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
  const user = await userModel.findById(decoded.id);

  if (!user) throw new Error("Unauthorized");
  if (user.isBlocked) throw new Error("Account blocked");

  if(decoded.tokenVersion!== user.refreshTokenVersion){
    throw new Error("Refresh Token invalid");
  }

  const tokens = genarateToken(user);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: tokens.accessToken,
  };
};

const sendOtp = async ({ email, purpose, userId }) => {
  if (!email || !purpose) {
    throw new Error("Email and purpose required");
  }

  let data = {};

  if (purpose === "email-change") {
    if (!userId) throw new Error("Unauthorized");
    data.userId = userId;

    await OTP.deleteMany({ purpose, "data.userId": userId });
  } else {
    await OTP.deleteMany({ email, purpose });
  }

  const otp = genarateOtp();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.create({
    email,
    otp: otpHash,
    purpose,
    attempts: 0,
    data,
  });

  await sendOTPEmail(email, otp);

  return { message: "OTP sent successfully" };
};

const forgotPassword = async ({ email }) => {
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User not found");
  if (!user.isVerified) throw new Error("Email not verified");

  await OTP.deleteMany({ email, purpose: "forgot" });

  const otp = genarateOtp();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.create({
    email,
    otp: otpHash,
    purpose: "forgot",
    attempts: 0,
  });

  await sendOTPEmail(email, otp);

  return { message: "Password reset OTP sent" };
};
const verifyForgotOtp = async ({ email, otp }) => {
  const record = await OTP.findOne({ email, purpose: "forgot" });
  if (!record) throw new Error("OTP expired");

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  if (otpHash !== record.otp) throw new Error("Invalid OTP");

  await OTP.deleteOne({ _id: record._id });
  return { message: "OTP verified" };
};

const resetPassword = async ({ email, password }) => {
  const hash = await bcrypt.hash(password, 10);
  await userModel.findOneAndUpdate({ email }, { password: hash });
  return { message: "Password reset successful" };
};

export const googleLogin = async (user) => {
  const tokens = genarateToken(user);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};


export const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await userModel.findById(userId).select("+password");

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("OLD_PASSWORD_WRONG");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return true;
};

const resendForgotOtp = async ({ email }) => {
  if (!email) throw new Error("Email required");

  await OTP.deleteMany({ email, purpose: "forgot" });

  const otp = genarateOtp();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.create({
    email,
    otp: otpHash,
    purpose: "forgot",
    attempts: 0,
  });

  await sendOTPEmail(email, otp);

  return { message: "OTP resent successfully" };
};


export default {signup,verifyOtp,resendOtp,login,refresh,forgotPassword,verifyForgotOtp,resetPassword,googleLogin,sendOtp,resendForgotOtp};
