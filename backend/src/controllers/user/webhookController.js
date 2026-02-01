import crypto from "crypto";
import dotenv from 'dotenv';
import { creditWallet } from "../../services/walletService.js";
import walletTransactionModel from "../../models/walletTransaction.js";

dotenv.config();


export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
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
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ message: "Webhook error" });
  }
};
