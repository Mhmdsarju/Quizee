import userModel from "../../models/userModel.js";
import quizModel from "../../models/quizModel.js";
import contestModel from "../../models/contestModel.js"
import { statusCode } from "../../constant/constants.js";



export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const activeQuizzes = await quizModel.countDocuments({ isActive:"true" });
    const activeContests = await contestModel.countDocuments({ status:"LIVE"  });

    const last7Days = await userModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 6)),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(statusCode.OK).json({
      totalUsers,
      activeQuizzes,
      activeContests,
      chartData: last7Days,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Dashboard stats error", error });
  }
};
