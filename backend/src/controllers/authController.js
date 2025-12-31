import authService from "../services/authService.js";
import { statusCode } from "../constant/constants.js";

const signup = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.signup(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(statusCode.CREATED).json({ user, accessToken });
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({ user, accessToken });
  } catch (error) {
    res.status(statusCode.UNAUTHORIZED).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const { accessToken } = await authService.refresh(token);
    res.json({ accessToken });
  } catch (error) {
    res.status(statusCode.FORBIDDEN).json({ message: error.message });
  }
};

export default { signup, login, refresh };
