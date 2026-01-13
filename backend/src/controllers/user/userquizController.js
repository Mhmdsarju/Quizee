import { statusCode } from "../../constant/constants.js";
import questionModel from "../../models/questionModel.js";
import { getQuizPlayService, getUserQuizByIdService, getUserQuizService, submitQuizService } from "../../services/quizService.js";


export const getUserQuizzes = async (req, res) => {
  try {
    const { search, category, page, sort } = req.query;
    const result = await getUserQuizService({search,category,page,sort,limit: 9,});
    res.json(result);
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const getUserQuizById = async (req, res) => {
  try {
    const { id: quizId } = req.params;

  const result = await getUserQuizByIdService(quizId);

  if (result.status === "NOT_FOUND") {
    return res.status(404).json({
      message: "Quiz not found",
    });
  }

  if (result.status === "INACTIVE") {
    return res.status(403).json({
      message: "Quiz unavailable now blocked by the Admin",
    });
  }

  res.json({
    quiz: result.quiz,
    totalQuestions: result.totalQuestions,
  });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};


export const getQuizPlay = async (req, res) => {
  try {
    const { quizId } = req.params;

    const result = await getQuizPlayService(quizId);

    if (result.status === "NOT_FOUND") {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (result.status === "INACTIVE") {
      return res.status(403).json({ message: "Quiz unavailable now" });
    }

    if (result.questions.length === 0) {
      return res.status(400).json({ message: "No questions in this quiz" });
    }

    res.json({
      quiz: result.quiz,
      questions: result.questions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



export const submitQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.user.id;
    const { answers } = req.body;

    const result = await submitQuizService(quizId, userId, answers);

    res.json({
      message: "Quiz submitted",
      ...result,
    });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const validateQuestion = async (req, res) => {
  const { quizId } = req.params;
  const { questionId } = req.body;

  const question = await questionModel.findOne({
    _id: questionId,
    quiz: quizId
  });

  if (!question) {
    return res.status(409).json({
      message: "This question was removed. Quiz has changed."
    });
  }

  res.json({ valid: true });
};
