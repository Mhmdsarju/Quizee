
import express from "express";
import { downloadCustomReportPDF, downloadDailyReportPDF, downloadMonthlyReportPDF, getCustomDateReport, getDailyReport, getDashboardSummary, getMonthlyReport, getReasonWiseReport, getTransactions } from "../controllers/admin/adminReportController.js";
import { protect,adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary",protect,adminOnly, getDashboardSummary);
router.get("/monthly",protect,adminOnly,  getMonthlyReport);
router.get("/reason-wise",protect,adminOnly,  getReasonWiseReport);
router.get("/transactions", protect,adminOnly, getTransactions);
router.get("/daily", protect,adminOnly, getDailyReport);
router.get("/custom", protect,adminOnly, getCustomDateReport);
router.get("/pdf/daily", downloadDailyReportPDF);
router.get("/pdf/monthly", downloadMonthlyReportPDF);
router.get("/pdf/custom", downloadCustomReportPDF);

export default router;
