import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quiz: {
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
      validate: [arr => arr.length === 4, "4 options required"],
    },

    correctAnswer: {
      type: Number, 
      required: true,
    },
  },
  { timestamps: true }
);

const questionModel = mongoose.model("Question", questionSchema);
export default questionModel;
