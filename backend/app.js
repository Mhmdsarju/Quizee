import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoute.js"
import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js'

dotenv.config();
connectDB();

const app =express();

app.use(cors({ origin: "http://localhost:5173",credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/admin',adminRoutes);
app.use("/api/user",userRoutes)



app.listen(5005, () =>
  console.log("Server running: http://localhost:5005")
);