import questionModel from "../models/questionModel.js";

export const addQuestionService = async (data) => {
  return await questionModel.create(data);
};

export const getQuestionsByQuizService = async (quizId) => {
  return await questionModel.find({ quizId: quizId });
};

export const updateQuestionService = async (id, data) => {
  return await questionModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteQuestionService = async (id) => {
  return await questionModel.findByIdAndDelete(id);
};
