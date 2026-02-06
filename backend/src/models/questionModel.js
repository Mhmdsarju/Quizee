import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
      validate: [arr => arr.length === 4, "4 options required"],
    },

    correctAnswer: {
      type: Number, 
      required: true,
    },
  },
  { timestamps: true }
);
questionSchema.index(
  { quizId: 1, question: 1 },
  { unique: true }
);

const questionModel = mongoose.model("Question", questionSchema);
export default questionModel;
