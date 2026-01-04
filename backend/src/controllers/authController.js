import authService from "../services/authService.js";
import { statusCode } from "../constant/constants.js";

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(statusCode.CREATED).json(result);
  } catch (e) {
    res.status(statusCode.BAD_REQUEST).json({ message: e.message });
  }
};

const verifyotp = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.verifyOtp(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.json({ user, accessToken });
  } catch (e) {
    res.status(statusCode.FORBIDDEN).json({ message: e.message });
  }
};

const resendotp = async (req, res) => {
  try {
    const result = await authService.resendOtp(req.body);
    res.json(result);
  } catch (e) {
    res.status(statusCode.TOO_MANY_REQUESTS).json({ message: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.json({ user, accessToken });
  } catch (e) {
    res.status(statusCode.UNAUTHORIZED).json({ message: e.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const verifyForgotOtp = async (req, res) => {
  try {
    const result = await authService.verifyForgotOtp(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const result = await authService.refresh(token);
    res.json(result);
  } catch (e) {
    res.status(statusCode.FORBIDDEN).json({ message: e.message });
  }
};
const resendForgotOtp = async (req, res) => {
  try {
    const result = await authService.resendForgotOtp(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};


const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });
  res.json({ message: "Logged out successfully" });
};

export default {signup,verifyotp,resendotp,login,refresh,logout,forgotPassword,verifyForgotOtp,resendForgotOtp,resetPassword};
