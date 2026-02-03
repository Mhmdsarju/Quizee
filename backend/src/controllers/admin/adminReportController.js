import walletTransactionModel from "../../models/walletTransaction.js";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";
import {generatePDF} from "../../utils/genarateReportPDF.js"



export const getDashboardSummary = async (req, res) => {
  try {
    const result = await walletTransactionModel.aggregate([
      {
        $group: {
          _id: null,

          income: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$reason",
                    ["add_money", "contest_fee", "referral_reward"],
                  ],
                },
                "$amount",
                0,
              ],
            },
          },

          expense: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$reason",
                    [
                      "reward",
                      "contest_reward",
                      "refund",
                      "admin_adjustment",
                    ],
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
        },
      },
    ]);

    const income = result[0]?.income || 0;
    const expense = result[0]?.expense || 0;

    res.json({
      totalIncome: income,
      totalExpense: expense,
      netProfit: income - expense,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
              $cond: [
                {
                  $in: [
                    "$reason",
                    ["add_money", "contest_fee", "referral_reward"],
                  ],
                },
                "$amount",
                0,
              ],
            },
          },

          expense: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$reason",
                    [
                      "reward",
                      "contest_reward",
                      "refund",
                      "admin_adjustment",
                    ],
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDailyReport = async (req, res) => {
  try {
    const data = await walletTransactionModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          income: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$reason",
                    ["add_money", "contest_fee", "referral_reward"],
                  ],
                },
                "$amount",
                0,
              ],
            },
          },

          expense: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$reason",
                    [
                      "reward",
                      "contest_reward",
                      "refund",
                      "admin_adjustment",
                    ],
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadDailyReportPDF = async (req, res) => {
  const data = await walletTransactionModel.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        income: {
          $sum: {
            $cond: [
              { $in: ["$reason", ["add_money", "contest_fee", "referral_reward"]] },
              "$amount",
              0,
            ],
          },
        },
        expense: {
          $sum: {
            $cond: [
              { $in: ["$reason", ["reward", "contest_reward", "refund", "admin_adjustment"]] },
              "$amount",
              0,
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const summary = data.reduce(
    (a, d) => ({
      income: a.income + d.income,
      expense: a.expense + d.expense,
    }),
    { income: 0, expense: 0 }
  );

  generatePDF({
    title: "Daily Wallet Report",
    rows: data.map((d) => ({
      label: d._id,
      income: d.income,
      expense: d.expense,
    })),
    summary,
    res,
  });
};

export const downloadMonthlyReportPDF = async (req, res) => {
  const data = await walletTransactionModel.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        income: {
          $sum: {
            $cond: [
              { $in: ["$reason", ["add_money", "contest_fee", "referral_reward"]] },
              "$amount",
              0,
            ],
          },
        },
        expense: {
          $sum: {
            $cond: [
              { $in: ["$reason", ["reward", "contest_reward", "refund", "admin_adjustment"]] },
              "$amount",
              0,
            ],
          },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const summary = data.reduce(
    (a, d) => ({
      income: a.income + d.income,
      expense: a.expense + d.expense,
    }),
    { income: 0, expense: 0 }
  );

  generatePDF({
    title: "Monthly Wallet Report",
    rows: data.map((d) => ({
      label: `${d._id.month}/${d._id.year}`,
      income: d.income,
      expense: d.expense,
    })),
    summary,
    res,
  });
};

export const getReasonWiseReport = async (req, res) => {
  try {
    const data = await walletTransactionModel.aggregate([
      {
        $group: {
          _id: "$reason",
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", type, reason } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (reason) filter.reason = reason;

    const result = await paginateAndSearch({
      model: walletTransactionModel,
      filter,
      search,
      searchFields: ["reason", "reference"],
      page: Number(page),
      limit: Number(limit),
      sort: { createdAt: -1 },
      populate: {
        path: "user",
        select: "name email",
      },
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
