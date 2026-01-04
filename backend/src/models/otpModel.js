import mongoose from "mongoose";

const otpModel = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60
  }
});

otpModel.index({ email: 1 });

const OTP = mongoose.model("OTP", otpModel);
export default OTP;
