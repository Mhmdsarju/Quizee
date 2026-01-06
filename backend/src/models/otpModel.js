import mongoose from "mongoose";

const otpModel = new mongoose.Schema({
  email: String,
  otp: String,
  purpose: {
    type: String,
    enum: ["signup", "forgot","email-change"],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  attempts: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60   
  }
});

otpModel.index({ email: 1 });

const OTP = mongoose.model("OTP", otpModel);
export default OTP;
