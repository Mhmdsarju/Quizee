import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyTransactions, getMyWallet } from "../controllers/user/userwalletController.js";

const router = express.Router();

router.get("/", protect, getMyWallet);
router.get("/transactions", protect, getMyTransactions);

export default router;
