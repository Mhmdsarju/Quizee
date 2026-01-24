import express from 'express';
import { blockContest, createContestHandler, editContest, endContest, getAdminContestsHandler } from '../controllers/admin/adminContestController';
import { protect,adminOnly } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/contest", protect, adminOnly, createContestHandler);

router.get("/contest", protect, adminOnly, getAdminContestsHandler);

// router.get("/contest/:id", protect, adminOnly, getadminOnlyContestById);

router.patch("/contest/:id", protect, adminOnly, editContest);

router.patch("/contest/:id/block", protect, adminOnly, blockContest);

router.patch("/contest/:id/end", protect, adminOnly, endContest);



export default router;


