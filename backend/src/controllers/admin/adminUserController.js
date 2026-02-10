import asyncHandler from "express-async-handler";
import userModel from "../../models/userModel.js";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";
import AppError from "../../utils/AppError.js";
import { statusCode } from "../../constant/constants.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const result = await paginateAndSearch({
    model: userModel,
    search,
    searchFields: ["name", "email"],
    page: Number(page),
    limit: Number(limit),
    select: "-password",
  });

  res.json(result);
});

export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError("User not found", statusCode.NOT_FOUND);
  }

  user.isBlocked = !user.isBlocked;

  if (user.isBlocked) {
    user.refreshTokenVersion += 1;
  }

  await user.save();

  res.json({
    message: user.isBlocked ? "User blocked" : "User unblocked",
    isBlocked: user.isBlocked,
  });
});
