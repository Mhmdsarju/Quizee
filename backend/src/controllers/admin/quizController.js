import { createQuizService, getAllQuizService, getQuizByIdService, QuizStatusService, updateQuizService } from "../../services/quizService";
import { statusCode } from "../../constant/constants.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, timeLimit, image } = req.body;

    if (!title || !category || !timeLimit) {
      return res.status(statusCode.BAD_REQUEST).json({ message: "Required fields missing" });
    }

    const quiz = await createQuizService({
      title,
      description,
      category,
      timeLimit,
      image: image || null,
    });

    res.status(statusCode.CREATED).json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const getAllQuiz = async (req, res) => {
  try {
    const quizzes = await getAllQuizService();
    res.json(quizzes);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await getQuizByIdService(req.params.id);
    if (!quiz) return res.status(statusCode.NOT_FOUND).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await updateQuizService(req.params.id, req.body);
    if (!quiz) return res.status(statusCode.NOT_FOUND).json({ message: "Quiz not found" });

    res.json({ message: "Quiz updated", quiz });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const toggleQuizStatus = async (req, res) => {
  try {
    const quiz = await QuizStatusService(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json({
      message: quiz.isActive ? "Quiz enabled" : "Quiz blocked",
      quiz,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};