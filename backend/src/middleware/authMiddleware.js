import jwt from "jsonwebtoken";
import { statusCode } from "../constant/constants.js";
import userModel from "../models/userModel.js";


export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(statusCode.UNAUTHORIZED).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const user = await userModel.findById(decoded.id)

    if (!user) {
      return res.status(statusCode.UNAUTHORIZED).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(statusCode.FORBIDDEN).json({ message: "User is Blocked by Admin" });
    }

    req.user = {
      id: user._id,
      role: user.role,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (err) {
    return res.status(statusCode.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
};


export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(statusCode.FORBIDDEN)
      .json({ message: "Admin access only" });
  }

  next();
};

