import express from "express";
import { protect,adminOnly } from "../middleware/authMiddleware.js";
import { getAllUsers, toggleBlockUser } from "../controllers/admin/adminUserController.js";

const router=express.Router();


router.get("/users",protect,adminOnly,getAllUsers);
router.patch("/users/:id/block",protect,adminOnly,toggleBlockUser)

export default router;