import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },

    totalScore: {
      type: Number,
      default: 0
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    referralCode: {
      type: String,
      unique: true,
      index: true
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    referralRewardGiven: {
      type: Boolean,
      default: false
    },

    isVerified: {
      type: Boolean,
      default: false
    },
    refreshTokenVersion: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model("User", userSchema)
export default userModel;
