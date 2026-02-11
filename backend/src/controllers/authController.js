import asyncHandler from "express-async-handler";
import authService, { changePasswordService } from "../services/authService.js";
import { statusCode } from "../constant/constants.js";
import AppError from "../utils/AppError.js";
import dotenv from "dotenv";

dotenv.config()
const FRONTEND_URL = process.env.FRONTEND_URL

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  domain: process.env.NODE_ENV === "production" ? ".quizee.online" : "localhost",
};

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  res.status(statusCode.CREATED).json(result);
});

export const googleCallback = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.googleLogin(req.user);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.redirect(`${FRONTEND_URL}/google-success?token=${accessToken}`);
  } catch {
    res.redirect(`${FRONTEND_URL}/login`);
  }
};

const verifyotp = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } =
    await authService.verifyOtp(req.body);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({ user, accessToken });
});

const resendotp = asyncHandler(async (req, res) => {
  const result = await authService.resendOtp(req.body);
  res.json(result);
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } =
    await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({ user, accessToken });
});

const sendOtp = asyncHandler(async (req, res) => {
  const result = await authService.sendOtp({
    email: req.body.email,
    purpose: req.body.purpose,
    userId:
      req.body.purpose === "email-change"
        ? req.user?.id
        : null,
  });

  res.json(result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  res.json(result);
});

const verifyForgotOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyForgotOtp(req.body);
  res.json(result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  res.json(result);
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError("Refresh token missing", statusCode.FORBIDDEN);
  }

  const result = await authService.refresh(token);
  res.json(result);
});

const resendForgotOtp = asyncHandler(async (req, res) => {
  const result = await authService.resendForgotOtp(req.body);
  res.json(result);
});

const logout = asyncHandler(async (req, res) => {
  
  res.cookie("refreshToken", "", {...cookieOptions,expires: new Date(0),});

  res.json({ message: "Logged out successfully" });
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    await changePasswordService(req.user.id, oldPassword, newPassword);
  } catch (err) {
    if (err.message === "OLD_PASSWORD_WRONG") {
      throw new AppError(
        "Old password incorrect",
        statusCode.BAD_REQUEST
      );
    }
    throw err;
  }

  res.json({ message: "Password changed successfully" });
});

export default {signup,verifyotp,resendotp,login,refresh,logout,forgotPassword,verifyForgotOtp,resendForgotOtp,resetPassword,sendOtp,googleCallback,changePassword,};
