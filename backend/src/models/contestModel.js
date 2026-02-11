import mongoose from "mongoose";


const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    questionsSnapshot: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
      }
    ],
    maxParticipants: {
      type: Number,
      default: null,
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

    image: {
      type: String,
      default: null,
    },
    prizeConfig: {
      first: {
        type: Number,
        default: 100,
      },
      second: {
        type: Number,
        default: 50,
      },
      third: {
        type: Number,
        default: 25,
      },
    },

  },
  { timestamps: true }
);



const contestModel = mongoose.model("Contest", contestSchema);
export default contestModel;