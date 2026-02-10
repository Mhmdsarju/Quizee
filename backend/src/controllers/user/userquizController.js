import asyncHandler from "express-async-handler";
import { statusCode } from "../../constant/constants.js";
import questionModel from "../../models/questionModel.js";
import {getQuizPlayService,getUserQuizByIdService,getUserQuizService,getUserRankService,submitQuizService,} from "../../services/quizService.js";
import AppError from "../../utils/AppError.js";

export const getUserQuizzes = asyncHandler(async (req, res) => {
  const { search = "", category, page = 1, sort } = req.query;

  const result = await getUserQuizService({
    search,
    category,
    page: Number(page),
    sort,
    limit: 9,
  });

  res.json(result);
});

export const getUserQuizById = asyncHandler(async (req, res) => {
  const { id: quizId } = req.params;

  const result = await getUserQuizByIdService(quizId);

  if (result.status === "NOT_FOUND") {
    throw new AppError("Quiz not found", statusCode.NOT_FOUND);
  }

  if (result.status === "INACTIVE") {
    throw new AppError(
      "Quiz unavailable now blocked by the Admin",
      statusCode.FORBIDDEN
    );
  }

  res.json({
    quiz: result.quiz,
    totalQuestions: result.totalQuestions,
  });
});

export const getQuizPlay = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { contest } = req.query;
  const userId = req.user.id;

  const result = await getQuizPlayService({
    quizId,
    contestId: contest,
    userId,
  });

  if (result.status === "NOT_FOUND") {
    throw new AppError("Quiz not found", statusCode.NOT_FOUND);
  }

  if (result.status === "INACTIVE") {
    throw new AppError("Quiz unavailable now", statusCode.FORBIDDEN);
  }

  if (result.status === "CONTEST_NOT_JOINED") {
    throw new AppError(
      "You are not registered for this contest",
      statusCode.FORBIDDEN
    );
  }

  if (result.status === "CONTEST_NOT_LIVE") {
    throw new AppError("Contest not live", statusCode.BAD_REQUEST);
  }

  if (result.questions.length === 0) {
    throw new AppError(
      "No questions in this quiz",
      statusCode.BAD_REQUEST
    );
  }

  res.json({
    quiz: result.quiz,
    questions: result.questions,
  });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const quizId = req.params.id;
  const userId = req.user.id;
  const { answers } = req.body;

  const result = await submitQuizService(quizId, userId, answers);

  res.json({
    message: "Quiz submitted",
    ...result,
  });
});

export const validateQuestion = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { questionId } = req.body;

  const question = await questionModel.findOne({
    _id: questionId,
    quizId,
  });

  if (!question) {
    throw new AppError(
      "This question was removed. Quiz has changed.",
      statusCode.CONFLICT
    );
  }

  res.json({ valid: true });
});

export const getMyRank = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const rankData = await getUserRankService(userId);

  if (!rankData) {
    throw new AppError("User not found", statusCode.NOT_FOUND);
  }

  res.json(rankData);
});
