import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: ["CONTEST"],
      default: "CONTEST"
    },

    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest"
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

 const notificationModel=mongoose.model("Notification", notificationSchema);
export default notificationModel;