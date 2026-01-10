import { createQuiz, getAllQuiz, getQuizById, toggleQuizStatus, updateQuiz } from "../controllers/admin/quizController";
import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware";
const router = express.Router();

router.post('/',protect,adminOnly,createQuiz);
router.get('/',protect,adminOnly,getAllQuiz)
router.get('/:id',protect,adminOnly,getQuizById);
router.put('/:id',protect,adminOnly,updateQuiz);
router.patch('/:id/status',protect,adminOnly,toggleQuizStatus)
