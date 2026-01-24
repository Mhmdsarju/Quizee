import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {addQuestion,getQuestionsByQuiz,updateQuestion,deleteQuestion,} from "../controllers/admin/adminquestionController.js";
import { uploadCSV } from "../middleware/uploadCSV.js";
import { uploadQuestionsCSV } from "../controllers/admin/adminquestionCSVcontroller.js";

const router = express.Router();

router.post("/", protect, adminOnly, addQuestion);
router.get("/:quizId", protect, adminOnly, getQuestionsByQuiz);
router.put("/:id", protect, adminOnly, updateQuestion);
router.delete("/:id", protect, adminOnly, deleteQuestion);
router.post("/upload-csv",protect,adminOnly,uploadCSV.single("file"),uploadQuestionsCSV);

export default router;
