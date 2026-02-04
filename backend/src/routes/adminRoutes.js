import express from "express";
import { protect,adminOnly } from "../middleware/authMiddleware.js";
import { blockUser, getAllUsers } from "../controllers/admin/adminUserController.js";
import { validate } from "../middleware/validate.js";
import { userIdUpdateSchema } from "../validations/userValidation.js";
import { getDashboardStats } from "../controllers/admin/admindashboardController.js";


const router=express.Router();


router.get("/users",protect,adminOnly,getAllUsers);
router.patch("/users/:id/block",protect,adminOnly,validate(userIdUpdateSchema),blockUser);
router.get("/dashboard-stats", getDashboardStats);

export default router;