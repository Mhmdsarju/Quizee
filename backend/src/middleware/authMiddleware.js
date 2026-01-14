import jwt from "jsonwebtoken";
import { statusCode } from "../constant/constants.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};


export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(statusCode.FORBIDDEN)
      .json({ message: "Admin access only" });
  }

  next();
};
