import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import userModel from "../models/userModel.js";
import { getQuizHistory, getQuizPlay, getUserQuizById, getUserQuizzes, submitQuiz, validateQuestion } from "../controllers/user/userquizController.js";
import authController from "../controllers/authController.js";
import { getContestLeaderboardHandler, getContestQuizPlayHandler, getUserContestHistoryHandler, getUserContestsHandler, joinContestHandler, submitContestQuizHandler } from "../controllers/user/userContestController.js";


const router = express.Router();

router.patch("/profile", protect, async (req, res) => {
  const { name } = req.body;

  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true }
  ).select("-password");

  res.json({ user });
});

router.get("/quizzes", protect, getUserQuizzes);
router.get("/quiz/:id", protect, getUserQuizById);
router.get("/quiz/:quizId/play", protect, getQuizPlay);
router.post("/quiz/:id/submit", protect, submitQuiz);
router.patch("/change-password", protect, authController.changePassword);
router.post("/quiz/:quizId/validate-question", protect, validateQuestion);
router.get("/quiz-history",protect,getQuizHistory);
router.get("/contest", protect, getUserContestsHandler);
router.post("/contest/:id/join", protect, joinContestHandler);
router.post("/contest/:id/submit",protect,submitContestQuizHandler);
router.get("/contest/:id/leaderboard",protect,getContestLeaderboardHandler);
router.get("/contest-history",protect,getUserContestHistoryHandler);
router.get("/contest/:id/play",protect,getContestQuizPlayHandler);
export default router;
