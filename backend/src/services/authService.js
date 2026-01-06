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

  if (exists && exists.isVerified) {
    throw new Error("User already exists and verified");
  }

  const hash = await bcrypt.hash(password, 10);

  if (!exists) {
    await userModel.create({
      name,
      email,
      password: hash,
      role: "user",
      referredBy: referredBy || null,
      isVerified: false
    });
  }

  await OTP.deleteMany({ email, purpose: "signup" });

  const otp = genarateOtp();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.create({
    email,
    otp: otpHash,
    purpose: "signup",
    attempts: 0
  });

  await sendOTPEmail(email, otp);

  return { message: "OTP sent to your email" };
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
const verifyOtp = async ({ email, otp, purpose }) => {
  if (!email || !otp || !purpose) {
    throw new Error("Email, OTP and purpose required");
  }

  const record = await OTP.findOne({ email, purpose });
  if (!record) throw new Error("OTP expired or invalid");

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  if (otpHash !== record.otp) {
    record.attempts += 1;
    await record.save();
    throw new Error("Invalid OTP");
  }

  let user;
  if (purpose === "email-change") {
    if (!record.data || !record.data.userId) {
      throw new Error("Unauthorized");
    }

    user = await userModel.findById(record.data.userId);
    if (!user) throw new Error("User not found");

    user.email = email;
    await user.save();
  }

  if (purpose === "signup") {
    user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    user.isVerified = true;
    await user.save();
  }

  await OTP.deleteMany({ _id: record._id });

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

  let data = {};

  if (purpose === "email-change") {
    const existingOtp = await OTP.findOne({ email, purpose });
    if (!existingOtp || !existingOtp.data?.userId) {
      throw new Error("Unauthorized");
    }

    data = { userId: existingOtp.data.userId };
  }

  await OTP.deleteMany({ email, purpose });

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

  return { message: "OTP resent successfully" };
};


const login = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email and password required");

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");
  if (!user.isVerified) throw new Error("Verify email first");
  if (user.isBlocked) throw new Error("Account blocked");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const tokens = genarateToken(user);

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  };
};
const refresh = async (token) => {
  if (!token) throw new Error("No refresh token");

  const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

  const user = await userModel.findById(decoded.id);
  if (!user) throw new Error("Unauthorized");

  if (user.isBlocked) {
    throw new Error("Account blocked");
  }

  const tokens = genarateToken(user);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role 
    },
    accessToken: tokens.accessToken
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
  if (!email) throw new Error("Email required");

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
    attempts: 0
  });

  await sendOTPEmail(email, otp);

  return { message: "Password reset OTP sent" };
};

const verifyForgotOtp = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email & OTP required");

  const record = await OTP.findOne({ email, purpose: "forgot" });
  if (!record) throw new Error("OTP expired");

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  if (otpHash !== record.otp) {
    record.attempts += 1;
    await record.save();
    throw new Error("Invalid OTP");
  }

  await OTP.deleteMany({ email, purpose: "forgot" });
  return { message: "OTP verified" };
};

const resetPassword = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email & password required");

  const hash = await bcrypt.hash(password, 10);
  await userModel.findOneAndUpdate({ email }, { password: hash });

  return { message: "Password reset successful" };
};
const resendForgotOtp = async ({ email }) => {
  await OTP.deleteMany({ email, purpose: "forgot" });

  const otp = genarateOtp();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.create({
    email,
    otp: otpHash,
    purpose: "forgot",
    attempts: 0
  });

  await sendOTPEmail(email, otp);

  return { message: "OTP resent" };
};

export default {signup,verifyOtp,resendOtp,login,refresh,forgotPassword,verifyForgotOtp,resetPassword,resendForgotOtp,sendOtp ,googleLogin};
