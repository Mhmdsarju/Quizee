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

    walletBalance: {
      type: Number,
      default: 0
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

const userModel= mongoose.model("User",userSchema)
export default userModel;
