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
    if (exists.isVerified) {
      throw new Error("User already exists and verified");
    }
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

  await OTP.deleteMany({ email });

  const otp = genarateOtp(); 
  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  await OTP.create({
    email,
    otp: otpHash,
    attempts: 0
  });

  await sendOTPEmail(email, otp);

  return { message: "OTP sent to your email" };
};

const verifyOtp = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email already verified");
  }

  const record = await OTP.findOne({ email });
  if (!record) {
    throw new Error("OTP expired or invalid");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await OTP.deleteMany({ email });
    throw new Error("Too many wrong attempts. Please resend OTP");
  }

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (otpHash !== record.otp) {
    record.attempts += 1;
    await record.save();

    throw new Error(
      `Invalid OTP. ${MAX_ATTEMPTS - record.attempts} attempts left`
    );
  }

  await OTP.deleteMany({ email });

  user.isVerified = true;
  await user.save();

  const tokens = genarateToken(user);
  return { user, ...tokens };
};

const resendOtp = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email already verified");
  }

  const existing = await OTP.findOne({ email });
  if (existing) {
    throw new Error("Please wait before resending OTP");
  }

  const otp = genarateOtp();
  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  await OTP.create({
    email,
    otp: otpHash,
    attempts: 0
  });

  await sendOTPEmail(email, otp);

  return { message: "OTP resent successfully" };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  if (user.isBlocked) {
    throw new Error("Account blocked");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const tokens = genarateToken(user);
  return { user, ...tokens };
};

const refresh = async (token) => {
  if (!token) throw new Error("No refresh token");

  const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
  const user = await userModel.findById(decoded.id).select("-password");

  if (!user || user.isBlocked) throw new Error("Unauthorized");

  const tokens = genarateToken(user);

  return {
    user,             
    accessToken: tokens.accessToken
  };
};

export default {signup,verifyOtp,resendOtp,login,refresh};
