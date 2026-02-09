
import { statusCode } from "../../constant/constants.js";
import contestModel from "../../models/contestModel.js";
import contestResultModel from "../../models/contestResultModel.js";
import { getContestLeaderboardService, getContestQuizPlayService, getUserContestsService, joinContestService, submitContestQuizService, } from "../../services/contestService.js";

export const getUserContestsHandler = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 9, sort = "newest", } = req.query;

    const result = await getUserContestsService({
      search,
      page: Number(page),
      limit: Number(limit),
      sort,
      userId: req.user.id,
    });

    res.json(result);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
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
        return res.status(statusCode.BAD_REQUEST).json({
          message: "Contest not started yet",
        });

      case "COMPLETED":
        return res.status(statusCode.BAD_REQUEST).json({
          message: "Contest already completed",
        });

      case "ALREADY_JOINED":
        return res.json({
          message: "Already joined. Redirecting to quiz...",
          quizId: result.quizId,
          contestId: result.contestId,
        });

      case "INSUFFICIENT_BALANCE":
        return res.status(statusCode.BAD_REQUEST).json({
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
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const submitContestQuizHandler = async (req, res) => {
  try {
    const { id: contestId } = req.params;
    const userId = req.user.id;
    const { answers, timeTaken } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "Answers array is required",
      });
    }

    const result = await submitContestQuizService({
      contestId,
      userId,
      answers,
      timeTaken,
    });

    if (result.status === "ALREADY_SUBMITTED") {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "You have already submitted this contest",
      });
    }
    if (result.status === "INVALID_ANSWERS") {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "Please answer all questions before submitting",
      });
    }

    if (result.status === "NO_QUESTIONS") {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "No questions found for this contest",
      });
    }


    res.json({
      message: "Contest quiz submitted successfully",
      score: result.result.score,
      total: result.result.total,
      percentage: result.result.percentage,
    });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
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
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};


export const getContestQuizPlayHandler = async (req, res) => {
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
          .status(statusCode.BAD_REQUEST)
          .json({ message: "No questions available" });

      case "SUCCESS":
        return res.json({
          quiz: result.quiz,
          questions: result.questions,
        });
    }
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

export const getContestStatusHandler = async (req, res) => {
  try {
    const contestId = req.params.id;
    const userId = req.user.id;

    const contest = await contestModel.findById(contestId).select(
      "title entryFee startTime endTime status isBlocked prizeConfig"
    );

    if (!contest) {
      return res
        .status(404)
        .json({ message: "Contest Not Found" });
    }

    const hasJoined = await contestResultModel.exists({
      contestId,
      userId,
    });

    res.json({
      _id: contest._id,
      title: contest.title,
      entryFee: contest.entryFee,
      startTime: contest.startTime,
      endTime: contest.endTime,
      status: contest.status,
      isBlocked: contest.isBlocked,
      prizeConfig: contest.prizeConfig, 
      hasJoined: !!hasJoined,
    });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};


export const getUserContestResultHandler = async (req, res) => {
  const result = await contestResultModel.findOne({
    contestId: req.params.id,
    userId: req.user.id,
  });

  if (!result) {
    return res.status(404).json({ message: "Result not found" });
  }

  res.json({
    score: result.score,
    total: result.total,
    percentage: result.percentage,
    rank: result.rank,
    rewardAmount: result.rewardAmount,
    certificateIssued: result.certificateIssued,
    certificateUrl: result.certificateUrl,
  });
};
