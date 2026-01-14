import jwt from "jsonwebtoken";
import { statusCode } from "../constant/constants.js";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(statusCode.UNAUTHORIZED).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.ACCESS_SECRET);
    next();
  } catch {
    res.status(statusCode.BAD_REQUEST).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(statusCode.UNAUTHORIZED).json({ message: "Admin only" });
  next();
};
