import quizAttemptModel from "../models/quizAttemptModel.js";
import contestResultModel from "../models/contestResultModel.js";
import { paginateAndSearch } from "../utils/paginateAndSearch.js";


export const getUserQuizHistoryService = async ({userId,page = 1,limit = 10,search = "",}) => {
  return paginateAndSearch({
    model: quizAttemptModel,
    query: { user: userId },
    page,
    limit,
    search,
    searchFields: ["quizTitle"], 
    populate: {
      path: "quiz",
      select: "title category",
    },
    sort: { createdAt: -1 },
  });
};
export const getUserContestHistoryService = async ({userId,page = 1,limit = 10,search = ""}) => {
  return paginateAndSearch({
    model: contestResultModel,
    query: { userId },
    page,
    limit,
    search,
    searchFields: ["contestTitle"], 
    populate: [
      { path: "contestId", select: "title" },
      { path: "quizId", select: "title" },
    ],
    sort: { createdAt: -1 },
  });
};
