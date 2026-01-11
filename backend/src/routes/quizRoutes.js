import { createQuiz, getAllQuiz, getQuizById, toggleQuizStatus, updateQuiz } from "../controllers/admin/quizController.js";
import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import upload from "../config/upload.js";
const router = express.Router();


router.post('/',protect,adminOnly,upload.single("image"),createQuiz);
router.get('/',protect,adminOnly,getAllQuiz)
router.get('/:id',protect,adminOnly,getQuizById);
router.put("/:id", protect, adminOnly, upload.single("image"), updateQuiz);
router.patch('/:id/status',protect,adminOnly,toggleQuizStatus)

export default router;