import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {addQuestion,getQuestionsByQuiz,updateQuestion,deleteQuestion,} from "../controllers/admin/questionController.js";

const router = express.Router();

router.post("/", protect, adminOnly, addQuestion);
router.get("/:quizId", protect, adminOnly, getQuestionsByQuiz);
router.put("/:id", protect, adminOnly, updateQuestion);
router.delete("/:id", protect, adminOnly, deleteQuestion);

export default router;
