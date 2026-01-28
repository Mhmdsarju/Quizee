
import contestModel from "../../models/contestModel.js";
import {
  getContestLeaderboardService,
  getContestQuizPlayService,
  getUserContestHistoryService,
  getUserContestsService,
  joinContestService,
  submitContestQuizService,
} from "../../services/contestService.js";

export const getUserContestsHandler = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 9,
      sort = "newest",
    } = req.query;

    const result = await getUserContestsService({
      search,
      page: Number(page),
      limit: Number(limit),
      sort,
      userId: req.user.id,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinContestHandler = async (req, res) => {
  try {
    const result = await joinContestService({
      contestId: req.params.id,
      userId: req.user.id,
    });

    switch (result.status) {
      case "NOT_STARTED":
        return res.status(400).json({
          message: "Contest not started yet",
        });

      case "COMPLETED":
        return res.status(400).json({
          message: "Contest already completed",
        });

      case "ALREADY_JOINED":
        return res.json({
          message: "Already joined. Redirecting to quiz...",
          quizId: result.quizId,
          contestId: result.contestId,
        });

      case "INSUFFICIENT_BALANCE":
        return res.status(400).json({
          message: "Insufficient wallet balance",
        });

      case "SUCCESS":
        return res.json({
          message: "Payment successful. Redirecting to quiz...",
          quizId: result.quizId,
          contestId: result.contestId,
        });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitContestQuizHandler = async (req, res) => {
  try {
    const { id: contestId } = req.params;
    const userId = req.user.id;
    const { score, total, percentage, timeTaken } = req.body;

    const result = await submitContestQuizService({
      contestId,
      userId,
      score,
      total,
      percentage,
      timeTaken,
    });

    if (result.status === "ALREADY_SUBMITTED") {
      return res.status(400).json({
        message: "You have already submitted this contest",
      });
    }

    res.json({
      message: "Contest quiz submitted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getContestLeaderboardHandler = async (req, res) => {
  try {
    const { id: contestId } = req.params;

    const leaderboard = await getContestLeaderboardService({
      contestId,
    });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserContestHistoryHandler = async (req, res) => {
  try {
    const history = await getUserContestHistoryService(req.user.id);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getContestQuizPlayHandler = async (req,res) => {
  try {
    const { id: contestId } = req.params;

    const result =
      await getContestQuizPlayService({
        contestId,
      });

    switch (result.status) {
      case "NOT_FOUND":
        return res
          .status(404)
          .json({ message: "Contest not found" });

      case "BLOCKED":
        return res
          .status(403)
          .json({ message: "Contest blocked" });

      case "NOT_STARTED":
        return res
          .status(403)
          .json({ message: "Contest not started" });

      case "ENDED":
        return res
          .status(403)
          .json({ message: "Contest ended" });

      case "NO_QUESTIONS":
        return res
          .status(400)
          .json({ message: "No questions available" });

      case "SUCCESS":
        return res.json({
          quiz: result.quiz,
          questions: result.questions,
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

export const getContestStatusHandler= async (req,res)=>{
  const contest= await contestModel.findById(req.params.id).select("isBlocked status");

  if(!contest){
    return res.status(404).json({message:"Contest Not Found"})
  }

  res.json({
    isBlocked:contest.isBlocked,
    status:contest.status,
  });
};