import mongoose from "mongoose";

const contestParticipationSchema = new mongoose.Schema({
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  score: Number,
  submittedAt: Date,
});


const contestParticipantsModel=mongoose.model("ContestParticipants",contestParticipationSchema);
export default contestParticipantsModel;