import walletTransactionModel from "../../models/walletTransaction.js";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";
import { generatePDF } from "../../utils/genarateReportPDF.js";
import { statusCode } from "../../constant/constants.js";

const INCOME_REASONS = ["add_money", "contest_fee", "referral_reward"];
const EXPENSE_REASONS = ["reward","contest_reward","refund","admin_adjustment"];


export const getDashboardSummary = async (req, res) => {
  try {
    const [result] = await walletTransactionModel.aggregate([
      {
        $group: {
          _id: null,
          income: {
            $sum: {
              $cond: [{ $in: ["$reason", INCOME_REASONS] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $in: ["$reason", EXPENSE_REASONS] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const income = result?.income || 0;
    const expense = result?.expense || 0;

    res.json({
      totalIncome: income,
      totalExpense: expense,
      netProfit: income - expense,
    });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};


export const getMonthlyReport = async (req, res) => {
  try {
    const data = await walletTransactionModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          income: {
            $sum: {
              $cond: [{ $in: ["$reason", INCOME_REASONS] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $in: ["$reason", EXPENSE_REASONS] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
export const getDailyReport = async (req, res) => {
  try {
    const data = await walletTransactionModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          income: {
            $sum: {
              $cond: [{ $in: ["$reason", INCOME_REASONS] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $in: ["$reason", EXPENSE_REASONS] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};


export const getCustomDateReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "From & To date required" });
    }

    const data = await walletTransactionModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          income: {
            $sum: {
              $cond: [{ $in: ["$reason", INCOME_REASONS] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $in: ["$reason", EXPENSE_REASONS] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};


export const downloadDailyReportPDF = async (req, res) => {
  try {
    const data = await walletTransactionModel.aggregate([
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            user: "$user",
            contestTitle: "$contestTitle",
          },

          entryFee: {
            $sum: {
              $cond: [{ $eq: ["$reason", "contest_fee"] }, "$amount", 0],
            },
          },

          reward: {
            $sum: {
              $cond: [{ $eq: ["$reason", "contest_reward"] }, "$amount", 0],
            },
          },

          refund: {
            $sum: {
              $cond: [{ $eq: ["$reason", "refund"] }, "$amount", 0],
            },
          },

          joinedAt: { $min: "$createdAt" },
        },
      },

      {
        $project: {
          label: "$_id.date",
          userId: "$_id.user",
          contestTitle: "$_id.contestTitle",
          entryFee: 1,
          reward: 1,
          refund: 1,
          joinedAt: 1,

          status: {
            $cond: [
              { $gt: ["$reward", 0] },
              "rewarded",
              {
                $cond: [{ $gt: ["$refund", 0] }, "refunded", "paid"],
              },
            ],
          },

          income: "$entryFee",
          expense: { $add: ["$reward", "$refund"] },
        },
      },

      { $sort: { joinedAt: -1 } },
    ]);

    const summary = data.reduce(
      (a, d) => ({
        income: a.income + d.income,
        expense: a.expense + d.expense,
      }),
      { income: 0, expense: 0 }
    );

    generatePDF({
      title: "Daily Quiz Participation Report",
      rows: data, 
      summary,
      res,
    });

    return;
  } catch (err) {
    if (!res.headersSent) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }
};




export const downloadMonthlyReportPDF = async (req, res) => {
  try {
    const data = await walletTransactionModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            user: "$user",
            contestTitle: "$contestTitle",
          },

          entryFee: {
            $sum: {
              $cond: [{ $eq: ["$reason", "contest_fee"] }, "$amount", 0],
            },
          },

          reward: {
            $sum: {
              $cond: [{ $eq: ["$reason", "contest_reward"] }, "$amount", 0],
            },
          },

          refund: {
            $sum: {
              $cond: [{ $eq: ["$reason", "refund"] }, "$amount", 0],
            },
          },

          joinedAt: { $min: "$createdAt" },
        },
      },

      {
        $project: {
          label: {
            $concat: [
              { $toString: "$_id.month" },
              "/",
              { $toString: "$_id.year" },
            ],
          },

          userId: "$_id.user",
          contestTitle: "$_id.contestTitle",

          entryFee: 1,
          reward: 1,
          refund: 1,

          status: {
            $cond: [
              { $gt: ["$reward", 0] },
              "rewarded",
              {
                $cond: [{ $gt: ["$refund", 0] }, "refunded", "paid"],
              },
            ],
          },

          income: "$entryFee",
          expense: { $add: ["$reward", "$refund"] },
          joinedAt: 1,
        },
      },

      { $sort: { joinedAt: -1 } },
    ]);

    const summary = data.reduce(
      (a, d) => ({
        income: a.income + d.income,
        expense: a.expense + d.expense,
      }),
      { income: 0, expense: 0 }
    );

    generatePDF({
      title: "Monthly Quiz Participation Report",
      rows: data,
      summary,
      res,
    });
  } catch (err) {
    if (!res.headersSent) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }
};




export const downloadCustomReportPDF = async (req, res) => {
  try {
    const { from, to } = req.query;

    const data = await walletTransactionModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
      },

      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            user: "$user",
            contestTitle: "$contestTitle",
          },

          entryFee: {
            $sum: {
              $cond: [{ $eq: ["$reason", "contest_fee"] }, "$amount", 0],
            },
          },

          reward: {
            $sum: {
              $cond: [{ $eq: ["$reason", "contest_reward"] }, "$amount", 0],
            },
          },

          refund: {
            $sum: {
              $cond: [{ $eq: ["$reason", "refund"] }, "$amount", 0],
            },
          },

          joinedAt: { $min: "$createdAt" },
        },
      },

      {
        $project: {
          label: "$_id.date",
          userId: "$_id.user",
          contestTitle: "$_id.contestTitle",

          entryFee: 1,
          reward: 1,
          refund: 1,

          status: {
            $cond: [
              { $gt: ["$reward", 0] },
              "rewarded",
              {
                $cond: [{ $gt: ["$refund", 0] }, "refunded", "paid"],
              },
            ],
          },

          income: "$entryFee",
          expense: { $add: ["$reward", "$refund"] },
          joinedAt: 1,
        },
      },

      { $sort: { joinedAt: -1 } },
    ]);

    const summary = data.reduce(
      (a, d) => ({
        income: a.income + d.income,
        expense: a.expense + d.expense,
      }),
      { income: 0, expense: 0 }
    );

    generatePDF({
      title: `Quiz Participation Report (${from} to ${to})`,
      rows: data,
      summary,
      res,
    });
  } catch (err) {
    if (!res.headersSent) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }
};

export const getReasonWiseReport = async (req, res) => {
  try {
    const data = await walletTransactionModel.aggregate([
      { $group: { _id: "$reason", totalAmount: { $sum: "$amount" } } },
      { $sort: { totalAmount: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const filter = {
      reason: {
        $in: ["refund", "reward", "contest_reward", "referral_reward"],
      },
    };

    const result = await paginateAndSearch({
      model: walletTransactionModel,
      filter,
      search,
      searchFields: ["reason"],
      page: Number(page),
      limit: Number(limit),
      sort: { createdAt: -1 },
      populate: {
        path: "user",
        select: "_id",
      },
    });

    res.json(result);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
