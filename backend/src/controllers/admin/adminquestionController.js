import {addQuestionService,getQuestionsByQuizService,updateQuestionService,deleteQuestionService,} from "../../services/questionService.js";
import { statusCode } from "../../constant/constants.js";

export const addQuestion = async (req, res) => {
  const { quizId, question, options, correctAnswer } = req.body;

  if (!quizId || !question || options?.length !== 4) {
    return res.status(statusCode.BAD_REQUEST).json({ message: "Invalid data" });
  }
  const q = await addQuestionService({
    quiz: quizId,
    question,
    options,
    correctAnswer,
  });

  res.status(statusCode.CREATED).json(q);
};

export const getQuestionsByQuiz = async (req, res) => {
  const questions = await getQuestionsByQuizService(req.params.quizId);
  res.json(questions);
};

export const updateQuestion = async (req, res) => {
  const updated = await updateQuestionService(req.params.id, req.body);
  res.json(updated);
};

export const deleteQuestion = async (req, res) => {
  await deleteQuestionService(req.params.id);
  res.json({ message: "Question deleted" });
};