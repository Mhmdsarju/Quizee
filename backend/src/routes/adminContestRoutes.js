import express from "express";
import {
  createContestHandler,
  getAdminContestsHandler,
  editContestHandler,
  toggleBlockContestHandler,
  endContestHandler,
} from "../controllers/admin/adminContestController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CONTEST MANAGEMENT ================= */

// CREATE CONTEST
router.post(
  "/",
  protect,
  adminOnly,
  createContestHandler
);

// LIST CONTESTS (SEARCH + PAGINATION)
router.get(
  "/",
  protect,
  adminOnly,
  getAdminContestsHandler
);

// EDIT CONTEST (only UPCOMING + not blocked)
router.patch(
  "/:id",
  protect,
  adminOnly,
  editContestHandler
);

// BLOCK / UNBLOCK CONTEST (TOGGLE)
router.patch(
  "/:id/block",
  protect,
  adminOnly,
  toggleBlockContestHandler
);

// END CONTEST (only LIVE)
router.patch(
  "/:id/end",
  protect,
  adminOnly,
  endContestHandler
);

export default router;
