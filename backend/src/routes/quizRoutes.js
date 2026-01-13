import { createQuiz, getAllQuiz, getQuizById,  updateQuiz, updateQuizStatus } from "../controllers/admin/adminquizController.js";
import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import upload from "../config/upload.js";
const router = express.Router();


router.post('/',protect,adminOnly,upload.single("image"),createQuiz);
router.get('/',protect,adminOnly,getAllQuiz)
router.get('/:id',protect,adminOnly,getQuizById);
router.put("/:id", protect, adminOnly, upload.single("image"), updateQuiz);
router.patch('/:id/status',protect,adminOnly,updateQuizStatus);


export default router;