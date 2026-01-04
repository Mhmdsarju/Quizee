import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyotp);
router.post("/resend-otp", authController.resendotp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/forgot-password/verify-otp", authController.verifyForgotOtp);
router.post("/forgot-password/resend-otp", authController.resendForgotOtp); 
router.post("/reset-password", authController.resetPassword);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
