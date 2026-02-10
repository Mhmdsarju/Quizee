import asyncHandler from "express-async-handler";
import { statusCode } from "../../constant/constants.js";
import contestModel from "../../models/contestModel.js";
import contestResultModel from "../../models/contestResultModel.js";
import {getContestLeaderboardService,getContestQuizPlayService,getUserContestsService,joinContestService,submitContestQuizService,} from "../../services/contestService.js";
import AppError from "../../utils/AppError.js";

export const getUserContestsHandler = asyncHandler(async (req, res) => {
  const {search = "",page = 1,limit = 9,sort = "newest",status} = req.query;

  const result = await getUserContestsService({
    search,
    page: Number(page),
    limit: Number(limit),
    sort,
    userId: req.user.id,
    status
  });

  res.json(result);
});

export const joinContestHandler = asyncHandler(async (req, res) => {
  const result = await joinContestService({
    contestId: req.params.id,
    userId: req.user.id,
  });

  switch (result.status) {
    case "NOT_STARTED":
      throw new AppError(
        "Contest not started yet",
        statusCode.BAD_REQUEST
      );

    case "COMPLETED":
      throw new AppError(
        "Contest already completed",
        statusCode.BAD_REQUEST
      );

    case "INSUFFICIENT_BALANCE":
      throw new AppError(
        "Insufficient wallet balance",
        statusCode.BAD_REQUEST
      );

    case "ALREADY_JOINED":
      return res.json({
        message: "Already joined. Redirecting to quiz...",
        quizId: result.quizId,
        contestId: result.contestId,
      });

    case "SUCCESS":
      return res.json({
        message: "Payment successful. Redirecting to quiz...",
        quizId: result.quizId,
        contestId: result.contestId,
      });

    default:
      throw new AppError(
        "Unable to join contest",
        statusCode.INTERNAL_SERVER_ERROR
      );
  }
});

export const submitContestQuizHandler = asyncHandler(async (req, res) => {
  const { id: contestId } = req.params;
  const userId = req.user.id;
  const { answers, timeTaken } = req.body;

  if (!Array.isArray(answers)) {
    throw new AppError(
      "Answers array is required",
      statusCode.BAD_REQUEST
    );
  }

  const result = await submitContestQuizService({
    contestId,
    userId,
    answers,
    timeTaken,
  });

  if (result.status === "ALREADY_SUBMITTED") {
    throw new AppError(
      "You have already submitted this contest",
      statusCode.BAD_REQUEST
    );
  }

  if (result.status === "INVALID_ANSWERS") {
    throw new AppError(
      "Please answer all questions before submitting",
      statusCode.BAD_REQUEST
    );
  }

  if (result.status === "NO_QUESTIONS") {
    throw new AppError(
      "No questions found for this contest",
      statusCode.BAD_REQUEST
    );
  }

  res.json({
    message: "Contest quiz submitted successfully",
    score: result.result.score,
    total: result.result.total,
    percentage: result.result.percentage,
  });
});

export const getContestLeaderboardHandler = asyncHandler(async (req, res) => {
  const leaderboard = await getContestLeaderboardService({
    contestId: req.params.id,
  });

  res.json(leaderboard);
});

export const getContestQuizPlayHandler = asyncHandler(async (req, res) => {
  const result = await getContestQuizPlayService({
    contestId: req.params.id,
  });

  switch (result.status) {
    case "NOT_FOUND":
      throw new AppError("Contest not found", statusCode.NOT_FOUND);

    case "BLOCKED":
      throw new AppError("Contest blocked", statusCode.FORBIDDEN);

    case "NOT_STARTED":
      throw new AppError("Contest not started", statusCode.FORBIDDEN);

    case "ENDED":
      throw new AppError("Contest ended", statusCode.FORBIDDEN);

    case "NO_QUESTIONS":
      throw new AppError(
        "No questions available",
        statusCode.BAD_REQUEST
      );

    case "SUCCESS":
      return res.json({
        quiz: result.quiz,
        questions: result.questions,
      });

    default:
      throw new AppError(
        "Unable to load contest",
        statusCode.INTERNAL_SERVER_ERROR
      );
  }
});

export const getContestStatusHandler = asyncHandler(async (req, res) => {
  const contestId = req.params.id;
  const userId = req.user.id;

  const contest = await contestModel
    .findById(contestId)
    .select(
      "title entryFee startTime endTime status isBlocked prizeConfig"
    );

  if (!contest) {
    throw new AppError("Contest Not Found", statusCode.NOT_FOUND);
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
});

export const getUserContestResultHandler = asyncHandler(async (req, res) => {
  const result = await contestResultModel.findOne({
    contestId: req.params.id,
    userId: req.user.id,
  });

  if (!result) {
    throw new AppError("Result not found", statusCode.NOT_FOUND);
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
});
