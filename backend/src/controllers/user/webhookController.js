import asyncHandler from "express-async-handler";
import crypto from "crypto";
import dotenv from "dotenv";
import { creditWallet } from "../../services/walletService.js";
import walletTransactionModel from "../../models/walletTransaction.js";
import AppError from "../../utils/AppError.js";
import { statusCode } from "../../constant/constants.js";

dotenv.config();

export const razorpayWebhook = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new AppError(
      "Webhook secret not configured",
      statusCode.INTERNAL_SERVER_ERROR
    );
  }

  const signature = req.headers["x-razorpay-signature"];

  if (!signature) {
    throw new AppError(
      "Missing webhook signature",
      statusCode.BAD_REQUEST
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body) 
    .digest("hex");

  if (signature !== expectedSignature) {
    throw new AppError(
      "Invalid webhook signature",
      statusCode.BAD_REQUEST
    );
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    const paymentId = payment.id;
    const amount = payment.amount / 100; 
    const userId = payment.notes?.userId;

    if (!userId) {
      return res.json({ status: "ok" });
    }

    const exists = await walletTransactionModel.findOne({
      reference: paymentId,
    });

    if (!exists) {
      await creditWallet({
        userId,
        amount,
        reason: "add_money",
        reference: paymentId,
      });
    }
  }

  res.json({ status: "ok" });
});
