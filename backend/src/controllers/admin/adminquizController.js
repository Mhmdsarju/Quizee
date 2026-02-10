import asyncHandler from "express-async-handler";
import {createQuizService,getAllQuizService,getQuizByIdService,QuizStatusService,updateQuizService,} from "../../services/quizService.js";
import { statusCode } from "../../constant/constants.js";
import cloudinary from "../../config/cloudinary.js";
import quizModel from "../../models/quizModel.js";
import AppError from "../../utils/AppError.js";

export const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, category, timeLimit } = req.body;

  let imageUrl = null;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "quiz-app/quizzes",
    });
    imageUrl = result.secure_url;
  }

  const quiz = await createQuizService({
    title,
    description,
    category,
    timeLimit,
    image: imageUrl,
  });

  const populatedQuiz = await quizModel
    .findById(quiz._id)
    .populate("category", "name");

  res.status(statusCode.CREATED).json({ quiz: populatedQuiz });
});

export const getAllQuiz = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const result = await getAllQuizService({
    search,
    page: Number(page),
    limit: Number(limit),
  });

  res.json(result);
});

export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await getQuizByIdService(req.params.id);

  if (!quiz) {
    throw new AppError("Quiz not found", statusCode.NOT_FOUND);
  }

  res.json(quiz);
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const { title, description, category, timeLimit } = req.body;

  let imageUrl;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "quiz-app/quizzes",
    });
    imageUrl = result.secure_url;
  }

  const data = {
    title,
    description,
    category,
    timeLimit,
  };

  if (imageUrl) {
    data.image = imageUrl;
  }

  const quiz = await updateQuizService(req.params.id, data);

  if (!quiz) {
    throw new AppError("Quiz not found", statusCode.NOT_FOUND);
  }

  const populatedQuiz = await quizModel
    .findById(quiz._id)
    .populate("category", "name");

  res.json({ quiz: populatedQuiz });
});

export const updateQuizStatus = asyncHandler(async (req, res) => {
  const quiz = await QuizStatusService(req.params.id);

  if (!quiz) {
    throw new AppError("Quiz not found", statusCode.NOT_FOUND);
  }

  res.json({
    message: quiz.isActive ? "Quiz enabled" : "Quiz blocked",
    quiz,
  });
});
