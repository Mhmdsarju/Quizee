import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: {
      type: Object,
      required: true,
    },
    score: Number,
    total: Number,
    percentage: Number,
  },
  { timestamps: true }
);

const quizAttemptModel= mongoose.model("QuizAttempt", quizAttemptSchema);

export default quizAttemptModel;