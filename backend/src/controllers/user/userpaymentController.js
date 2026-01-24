import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { creditWallet } from "../../services/walletService.js";
import walletTransactionModel from "../../models/walletTransaction.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: Number(amount) * 100,
    currency: "INR",
    notes: {
      userId: req.user.id,
    },
  });

  res.json(order);
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,amount,} = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
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
  } catch (err) {
    console.error("Verify payment error:", err.message);
    res.status(500).json({ message: "Payment verification error" });
  }
};
