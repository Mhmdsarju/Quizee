import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoute.js"
import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js'
import "./src/config/passport.js";
import categoryRoutes from './src/routes/categoryRoutes.js'
import quizRoutes from './src/routes/quizRoutes.js'
import questionRoutes from './src/routes/questionRoutes.js'
import paymentRoutes from './src/routes/paymentRoutes.js'
import walletRoutes from './src/routes/userWalletRoutes.js'
import webhookRoutes from './src/routes/webhookRoutes.js'
import admincontestRoutes from './src/routes/adminContestRoutes.js'
import adminReportRoutes from './src/routes/adminReportRoutes.js'
import { contestStatusCron } from "./src/utils/contestStatusCron.js";
import path from "path";
import { apiLimiter } from "./src/utils/rateLimiter.js";
import morgan from "morgan";
import { logger } from "./src/utils/logger.js";
import { errorHandler } from "./src/middleware/errorHandler.js";



dotenv.config();
connectDB();
contestStatusCron();

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL,process.env.ADMIN_URL,];


app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

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

// app.use("/api",apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/quiz", quizRoutes);
app.use("/api/admin/questions", questionRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin/contest", admincontestRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/certificates",express.static(path.join(process.cwd(), "uploads/certificates")));

app.use(errorHandler)

export default app;
