import mongoose from "mongoose";

const contestResultSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },

    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    contestTitle: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: Number,
    total: Number,
    percentage: Number,
    timeTaken: Number,

    rank: Number,

    rewardAmount: {
      type: Number,
      default: 0,
    },
    rewardCredited: {
      type: Boolean,
      default: false,
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

contestResultSchema.index({ contestId: 1, userId: 1 }, { unique: true });

const contestResultModel = mongoose.model("ContestResult", contestResultSchema);

export default contestResultModel;




