import mongoose from "mongoose";


const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true, // 🔥 very important
    },

    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    rules: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],

    maxParticipants: {
      type: Number,
      default: null, // null = unlimited
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "LIVE", "COMPLETED", "BLOCKED"],
      default: "UPCOMING",
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);



const contestModel = mongoose.model("Contest",contestSchema);
export default contestModel;