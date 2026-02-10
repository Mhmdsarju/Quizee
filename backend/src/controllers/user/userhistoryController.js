import asyncHandler from "express-async-handler";
import { statusCode } from "../../constant/constants.js";
import {getUserContestHistoryService,getUserQuizHistoryService,} from "../../services/historyService.js";
import AppError from "../../utils/AppError.js";

export const getQuizHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const result = await getUserQuizHistoryService({
    userId: req.user.id,
    page: Number(page),
    limit: Number(limit),
    search,
  });

  res.json(result);
});

export const getUserContestHistoryHandler = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const result = await getUserContestHistoryService({
    userId: req.user.id,
    page: Number(page),
    limit: Number(limit),
    search,
  });

  res.json(result);
});
