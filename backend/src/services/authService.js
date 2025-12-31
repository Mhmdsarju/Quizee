import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { genarateToken } from "../utils/genarateToken.js";

const signup = async ({ name, email, password, referredBy }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const exists = await userModel.findOne({ email });
  if (exists) {
    throw new Error("User already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name,
    email,
    password: hash,
    role: "user",
    referredBy: referredBy || null, 
  });

  const tokens = genarateToken(user);
  return { user, ...tokens };
};


const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");
  if (user.isBlocked) throw new Error("Account blocked");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const tokens = genarateToken(user);
  return { user, ...tokens };
};

const refresh = async (token) => {
  if (!token) throw new Error("No refresh token");

  const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
  const user = await userModel.findById(decoded.id);

  if (!user || user.isBlocked) throw new Error("Unauthorized");

  return genarateToken(user);
};

export default { signup, login, refresh };
