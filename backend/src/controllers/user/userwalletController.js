import walletTransactionModel from "../../models/walletTransaction.js";
import { getUserWallet } from "../../services/walletService.js";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";

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

    const {
      page = 1,
      limit = 5,
    } = req.query;

    const result = await paginateAndSearch({
      model: walletTransactionModel,

      filter: {
        user: req.user.id,
      },

      page: Number(page),
      limit: Number(limit),

      sort: { createdAt: -1 },
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
