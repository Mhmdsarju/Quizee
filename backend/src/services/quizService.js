import questionModel from "../models/questionModel.js";
import quizModel from "../models/quizModel.js";
import { paginateAndSearch } from "../utils/paginateAndSearch.js";
import quizAttemptModel from "../models/quizAttemptModel.js";



export const createQuizService=async(data)=>{
return await quizModel.create(data);
}


export const getAllQuizService = async ({ search = "", page = 1, limit = 10 }) => {
  const result = await paginateAndSearch({
    model: quizModel,
    search,
    searchFields: ["title"],
    page,
    limit,
    populate: { path: "category", select: "name" },
    sort: { createdAt: -1 },
  });

  const quizzesWithCount = await Promise.all(
    result.data.map(async (quiz) => {
      const count = await questionModel.countDocuments({
        quiz: quiz._id,
      });

      return {
        ...quiz.toObject(),
        questionCount: count,
      };
    })
  );

  return {
    ...result,
    data: quizzesWithCount,
  };
};



export const getQuizByIdService = async (id) => {
  return await quizModel.findById(id).populate("category", "name");
};


export const updateQuizService = async (id, data) => {
  return await quizModel.findByIdAndUpdate(id, data, { new: true });
};

export const QuizStatusService = async (id) => {
  const quiz = await quizModel.findById(id);
  if (!quiz) return null;

  quiz.isActive = !quiz.isActive;
  await quiz.save();

  return quiz;
};

export const getUserQuizService = async ({search = "",category,page = 1,limit = 9,sort = "newest",}) => {
  let query = { isActive: true };

  if (category) {
    query.category = category;
  }

  let sortQuery = { createdAt: -1 };

  if (sort === "newest") {
    sortQuery = { createdAt: -1 };
  }

  if (sort === "popular") {
    sortQuery = { attempts: -1 }; 
  }


  const result = await paginateAndSearch({
    model: quizModel,
    query,                 
    search,
    searchFields: ["title"],
    page,
    limit,
    populate: { path: "category", select: "name" },
    sort: sort === "questions" ? {} : sortQuery,
  });
const quizzesWithCount = await Promise.all(
  result.data.map(async (quiz) => {
    const count = await questionModel.countDocuments({ quiz: quiz._id });
    return { ...quiz.toObject(), questionCount: count };
  })
);

const filtered = quizzesWithCount.filter(q => q.questionCount > 0);

  if (sort === "questions") {
    quizzesWithCount.sort((a, b) => b.questionCount - a.questionCount);
  }

  return {
    ...result,
    data: filtered,
  };
};

export const getUserQuizByIdService = async (quizId) => {
  const quiz = await quizModel.findOne({ _id: quizId}).populate("category", "name");

  if (!quiz) return {status:"NOT_FOUND"};

  if(!quiz.isActive){
    return {status:"INACTIVE"}
  }

  const totalQuestions = await questionModel.countDocuments({
    quiz: quizId,
  });

  return {
    status:"OK",
    quiz,
    totalQuestions,
  };
};


export const submitQuizService = async (quizId, userId, answers) => {
  const questions = await questionModel.find({ quiz: quizId });

  let score = 0;

  const correctAnswers = questions.map((q) => {
    const userAnswer = answers[q._id.toString()];  

    if (userAnswer === q.correctAnswer) {
      score++;
    }

    return {
      question: q.question,
      correctOption: q.options[q.correctAnswer],
      userOption:
        userAnswer !== undefined ? q.options[userAnswer] : "Not answered",
      isCorrect: userAnswer === q.correctAnswer,
    };
  });

  const total = questions.length;
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

  const attempt = await quizAttemptModel.create({
    user: userId,
    quiz: quizId,
    answers,
    score,
    total,
    percentage,
  });

  await quizModel.findByIdAndUpdate(quizId, {
    $inc: { attempts: 1 },
  });

  return {
    score,
    total,
    percentage,
    attemptId: attempt._id,
    correctAnswers,
  };
};






export const getQuizPlayService = async (quizId) => {
  const quiz = await quizModel
    .findById(quizId)
    .populate("category", "name");

  if (!quiz) {
    return { status: "NOT_FOUND" };
  }

  if (!quiz.isActive) {
    return { status: "INACTIVE" };
  }

  const questions = await questionModel
    .find({ quiz: quizId })
    .select("question options correctAnswer");

  return {
    status: "OK",
    quiz: {
      _id: quiz._id,
      title: quiz.title,
      timeLimit: quiz.timeLimit,
      category: quiz.category,
    },
    questions,
  };
};