import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

dotenv.config();
connectDB();

const app =express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(5005, () =>
  console.log("Server running: http://localhost:5005")
);