import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      enum: ["add_money", "contest_fee", "reward", "refund", "admin_adjustment","contest_reward","referral_reward"],
      required: true,
    },
    reference: {
      type: String, 
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const walletTransactionModel = mongoose.model("WalletTransaction",walletTransactionSchema);

export default walletTransactionModel;
