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
  profileImage: {
      type: String,
      default: null,
    },
    walletBalance: {
      type: Number,
      default: 0,
      min:[0,"wallet balance cannot be negative"]
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    isVerified:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true
  }
);

const userModel= mongoose.model("User",userSchema)
export default userModel;
