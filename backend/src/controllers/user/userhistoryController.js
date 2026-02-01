import { statusCode } from "../../constant/constants.js";
import { getUserContestHistoryService, getUserQuizHistoryService } from "../../services/historyService.js";


export const getQuizHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const result = await getUserQuizHistoryService({
      userId: req.user.id,
      page: Number(page),
      limit: Number(limit),
      search,
    });

    res.json(result);
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

export const getUserContestHistoryHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const result = await getUserContestHistoryService({
      userId: req.user.id,
      page: Number(page),
      limit: Number(limit),
      search,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
