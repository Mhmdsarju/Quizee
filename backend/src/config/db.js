import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;