import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import userModel from "../models/userModel.js";
import { getQuizPlay, getUserQuizById, getUserQuizzes, submitQuiz, validateQuestion } from "../controllers/user/userquizController.js";
import authController from "../controllers/authController.js";


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


export default router;
