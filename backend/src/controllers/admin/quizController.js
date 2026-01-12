import {createQuizService,getAllQuizService,getQuizByIdService,QuizStatusService,updateQuizService,} from "../../services/quizService.js";
import { statusCode } from "../../constant/constants.js";
import cloudinary from "../../config/cloudinary.js";
import quizModel from "../../models/quizModel.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, timeLimit } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "quiz-app/quizzes",
      });
      imageUrl = result.secure_url;
    }

    const quiz = await createQuizService({title,description,category,timeLimit,image: imageUrl});

    const populatedQuiz = await quizModel.findById(quiz._id).populate("category", "name");
    res.status(statusCode.CREATED).json({ quiz: populatedQuiz });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const getAllQuiz = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const result = await getAllQuizService({search,page,limit,});

    res.json(result);
  } catch (err) {
    console.error("ADMIN QUIZ ERROR:", err);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch quizzes" });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await getQuizByIdService(req.params.id);
    if (!quiz)
      return res.status(statusCode.NOT_FOUND).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { title, description, category, timeLimit } = req.body;

    let imageUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "quiz-app/quizzes",
      });
      imageUrl = result.secure_url;
    }

    const data = {title,description,category,timeLimit,};

    if (imageUrl) {
      data.image = imageUrl;
    }

    const quiz = await updateQuizService(req.params.id, data);

    if (!quiz)
      return res.status(404).json({ message: "Quiz not found" });

    const populatedQuiz = await quizModel.findById(quiz._id).populate("category", "name");
    res.json({ quiz: populatedQuiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const toggleQuizStatus = async (req, res) => {
  try {
    const quiz = await QuizStatusService(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({message: quiz.isActive ? "Quiz enabled" : "Quiz blocked",quiz,});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


