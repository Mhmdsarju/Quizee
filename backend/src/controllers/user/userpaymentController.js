import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { creditWallet } from "../../services/walletService.js";
import walletTransactionModel from "../../models/walletTransaction.js";
import { statusCode } from "../../constant/constants.js";
import AppError from "../../utils/AppError.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", statusCode.UNAUTHORIZED);
  }

  const { amount } = req.body;

  if (!amount || Number(amount) <= 0) {
    throw new AppError(
      "Valid amount is required",
      statusCode.BAD_REQUEST
    );
  }

  const order = await razorpay.orders.create({
    amount: Number(amount) * 100, 
    currency: "INR",
    notes: {
      userId: req.user.id,
    },
  });

  res.json(order);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", statusCode.UNAUTHORIZED);
  }

  const {razorpay_order_id,razorpay_payment_id,razorpay_signature,amount,} = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    throw new AppError(
      "Invalid payment data",
      statusCode.BAD_REQUEST
    );
  }

  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (sign !== razorpay_signature) {
    throw new AppError(
      "Payment verification failed",
      statusCode.BAD_REQUEST
    );
  }

  const exists = await walletTransactionModel.findOne({
    reference: razorpay_payment_id,
  });

  if (!exists) {
    await creditWallet({
      userId: req.user.id,
      amount: Number(amount),
      reason: "add_money",
      reference: razorpay_payment_id,
    });
  }

  res.json({ message: "Wallet credited successfully" });
});
