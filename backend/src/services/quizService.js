import quizModel from "../models/quizModel.js";
import { paginateAndSearch } from "../utils/paginateAndSearch.js";


export const createQuizService=async(data)=>{
return await quizModel.create(data);
}

export const getAllQuizService = async ({search = "",page = 1,limit = 10,}) => {
  return await paginateAndSearch({
    model: quizModel,
    search,
    searchFields: ["title"],
    page: Number(page),
    limit: Number(limit),
    populate: { path: "category", select: "name" },
    sort: { createdAt: -1 },
  });
};


export const getQuizByIdService = async (id) => {
  return await quizModel
    .findById(id)
    .populate("category", "name");
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