import walletTransactionModel from "../../models/walletTransaction.js";
import { getUserWallet } from "../../services/walletService.js";

export const getMyWallet = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const wallet = await getUserWallet(req.user.id);
    res.json({ balance: wallet.balance });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactions = await walletTransactionModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
