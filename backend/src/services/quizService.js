import quizModel from "../models/quizModel";

export const createQuizService=async(data)=>{
return await quizModel.create(data);
}

export const getAllQuizService=async()=>{
return await quizModel.find().populate("category","name").sort({createdAt:-1});
}

export const getQuizByIdService = async (id) => {
  return await quizModel.findById(id);
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