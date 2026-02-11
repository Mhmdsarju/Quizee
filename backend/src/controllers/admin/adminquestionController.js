import asyncHandler from "express-async-handler";
import {addQuestionService,getQuestionsByQuizService,updateQuestionService,deleteQuestionService,} from "../../services/questionService.js";
import { statusCode } from "../../constant/constants.js";
import questionModel from "../../models/questionModel.js";
import AppError from "../../utils/AppError.js";

export const addQuestion = asyncHandler(async (req, res) => {
  const { quizId, question, options, correctAnswer } = req.body;

  if (!quizId || !question || options?.length !== 4) {
    throw new AppError("Invalid data", statusCode.BAD_REQUEST);
  }

  const exists = await questionModel.findOne({
    quizId,
    question: question.trim(),
  });

  if (exists) {
    throw new AppError("Question already exists", statusCode.CONFLICT);
  }

  try {
    const q = await addQuestionService({
      quizId,
      question: question.trim(),
      options,
      correctAnswer,
    });

    res.status(statusCode.CREATED).json(q);
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError("Question already exists", statusCode.CONFLICT);
    }
    throw err;
  }
});

export const getQuestionsByQuiz = asyncHandler(async (req, res) => {
  const questions = await getQuestionsByQuizService(req.params.quizId);
  res.json(questions);
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const updated = await updateQuestionService(req.params.id, req.body);

  if (!updated) {
    throw new AppError("Question not found", statusCode.NOT_FOUND);
  }

  res.json(updated);
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const deleted = await deleteQuestionService(req.params.id);

  if (!deleted) {
    throw new AppError("Question not found", statusCode.NOT_FOUND);
  }

  res.json({ message: "Question deleted" });
});

