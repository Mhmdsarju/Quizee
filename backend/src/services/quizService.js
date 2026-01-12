import questionModel from "../models/questionModel.js";
import quizModel from "../models/quizModel.js";
import { paginateAndSearch } from "../utils/paginateAndSearch.js";


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

