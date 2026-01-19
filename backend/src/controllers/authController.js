import authService,{ changePasswordService } from "../services/authService.js";
import { statusCode } from "../constant/constants.js";

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(statusCode.CREATED).json(result);
  } catch (e) {
    res.status(statusCode.BAD_REQUEST).json({ message: e.message });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.googleLogin(req.user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, 
    });

    res.redirect(`http://localhost:5173/google-success?token=${accessToken}`);
  } catch (err) {
    res.redirect("http://localhost:5173/login");
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

const sendOtp = async (req, res) => {
  try {
    const result = await authService.sendOtp({
      email: req.body.email,
      purpose: req.body.purpose,
      userId:
        req.body.purpose === "email-change"
          ? req.user?.id
          : null,
    });

    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
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
    // 🔥 IMPORTANT: clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false // prod-la true
    });

    return res
      .status(statusCode.FORBIDDEN)
      .json({ message: e.message });
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


 const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    await changePasswordService(req.user.id, oldPassword, newPassword);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    if (error.message === "OLD_PASSWORD_WRONG") {
      return res.status(statusCode.BAD_REQUEST).json({ message: "Old password incorrect" });
    }

    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to change password" });
  }
};

export default {signup,verifyotp,resendotp,login,refresh,logout,forgotPassword,verifyForgotOtp,resendForgotOtp,resetPassword,sendOtp,googleCallback,changePassword};
