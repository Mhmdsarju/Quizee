import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true, // 🔥 very important
  },

  entryFee: {
    type: Number,
    required: true,
  },

  rules: [
    {
      title: String,
      description: String,
    }
  ],

  maxParticipants: Number,

  startTime: Date,
  endTime: Date,

  status: {
    type: String,
    enum: ["UPCOMING", "LIVE", "COMPLETED", "BLOCKED"],
    default: "UPCOMING",
  },

}, { timestamps: true });

const contestModel = mongoose.model("Contest",contestSchema);
export default contestModel;