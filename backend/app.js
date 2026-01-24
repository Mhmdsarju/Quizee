import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoute.js"
import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js'
import passport from "passport";
import "./src/config/passport.js";
import categoryRoutes from './src/routes/categoryRoutes.js'
import quizRoutes from './src/routes/quizRoutes.js'
import questionRoutes from './src/routes/questionRoutes.js'
import paymentRoutes from './src/routes/paymentRoutes.js'
import walletRoutes from './src/routes/userWalletRoutes.js'
import webhookRoutes from './src/routes/webhookRoutes.js'

dotenv.config();
connectDB();

const app =express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://admin.localhost:5173"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use("/webhook", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth',authRoutes);
app.use('/api/admin',adminRoutes);
app.use("/api/user",userRoutes);
app.use("/api/admin/categories",categoryRoutes);
app.use('/api/admin/quiz/',quizRoutes);
app.use('/api/admin/questions/',questionRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/wallet',walletRoutes);



app.listen(5005, () =>
  console.log("Server running: http://localhost:5005")
);
