import asyncHandler from "express-async-handler";
import walletTransactionModel from "../../models/walletTransaction.js";
import { getUserWallet } from "../../services/walletService.js";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";
import AppError from "../../utils/AppError.js";
import { statusCode } from "../../constant/constants.js";

export const getMyWallet = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", statusCode.UNAUTHORIZED);
  }

  const wallet = await getUserWallet(req.user.id);

  res.json({ balance: wallet.balance });
});

export const getMyTransactions = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", statusCode.UNAUTHORIZED);
  }

  const { page = 1, limit = 5 } = req.query;

  const result = await paginateAndSearch({
    model: walletTransactionModel,
    filter: { user: req.user.id },
    page: Number(page),
    limit: Number(limit),
    sort: { createdAt: -1 },
  });

  res.json(result);
});
