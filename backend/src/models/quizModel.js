import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    },

    description: {
      type: String,
    },
    image: {
      type: String, 
      default: null,  
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    timeLimit: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const quizModel= mongoose.model("Quiz", quizSchema);

export default quizModel;