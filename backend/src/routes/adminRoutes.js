import express from "express";
import { protect,adminOnly } from "../middleware/authMiddleware.js";
import { getAllUsers, toggleBlockUser } from "../controllers/admin/adminUserController.js";
import { validate } from "../middleware/validate.js";
import { userIdUpdateSchema } from "../validations/userValidation.js";

const router=express.Router();


router.get("/users",protect,adminOnly,getAllUsers);
router.patch("/users/:id/block",protect,adminOnly,validate(userIdUpdateSchema),toggleBlockUser)

export default router;