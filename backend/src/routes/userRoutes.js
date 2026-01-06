import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import userModel from "../models/userModel.js";

const router = express.Router();

router.patch("/profile", protect, async (req, res) => {
  const { name } = req.body;

  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true }
  ).select("-password");

  res.json({ user });
});

export default router;
