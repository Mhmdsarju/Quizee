import express from "express";
import { createCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/admin/categoryController";
import { adminOnly, protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/',protect,adminOnly,createCategory);
router.get("/", protect, adminOnly, getAllCategory);
router.patch("/:id", protect, adminOnly, updateCategory);
router.patch("/:id/status", protect, adminOnly, deleteCategory);

export default router;