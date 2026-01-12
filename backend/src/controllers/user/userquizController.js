import { getQuizPlayService, getUserQuizByIdService, getUserQuizService, submitQuizService } from "../../services/quizService.js";


export const getUserQuizzes = async (req, res) => {
  try {
    const { search, category, page, sort } = req.query;
    const result = await getUserQuizService({search,category,page,sort,limit: 9,});
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserQuizById = async (req, res) => {
  try {
    const quiz = await getUserQuizByIdService(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getQuizPlay = async (req, res) => {
  try {
    const { quizId } = req.params;

    const data = await getQuizPlayService(quizId);

    if (!data) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (data.questions.length === 0) {
      return res.status(400).json({ message: "No questions in this quiz" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


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
    res.status(500).json({ message: err.message });
  }
};
