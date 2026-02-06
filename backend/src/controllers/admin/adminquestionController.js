import {addQuestionService,getQuestionsByQuizService,updateQuestionService,deleteQuestionService,} from "../../services/questionService.js";
import { statusCode } from "../../constant/constants.js";
import questionModel from "../../models/questionModel.js";


export const addQuestion = async (req, res) => {
  try {
    const { quizId, question, options, correctAnswer } = req.body;

    if (!quizId || !question || options?.length !== 4) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: "Invalid data" });
    }

    const exists = await questionModel.findOne({
      quizId,
      question: question.trim(),
    });

    if (exists) {
      return res
        .status(statusCode.CONFLICT)
        .json({ message: "Question already exists" });
    }

    const q = await addQuestionService({
      quizId,
      question: question.trim(),
      options,
      correctAnswer,
    });

    res.status(statusCode.CREATED).json(q);
  } catch (error) {
    console.error("Add Question Error:", error);

    if (error.code === 11000) {
      return res
        .status(statusCode.CONFLICT)
        .json({ message: "Question already exists" });
    }

    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
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