import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const genarateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "25m" },
  );
  const refreshToken = jwt.sign(
    { id: user._id, tokenVersion: user.refreshTokenVersion },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
};
