import express from "express";
import { createContestHandler, getAdminContestsHandler, editContestHandler, toggleBlockContestHandler, endContestHandler, } from "../controllers/admin/adminContestController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect,adminOnly,createContestHandler);

router.get("/",protect,adminOnly,getAdminContestsHandler);

router.patch("/:id",protect,adminOnly,editContestHandler);

router.patch("/:id/block",protect,adminOnly,toggleBlockContestHandler);

router.patch("/:id/end",protect,adminOnly,endContestHandler);

export default router;
