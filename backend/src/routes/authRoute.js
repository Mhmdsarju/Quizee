import express from "express";
import authController, { googleCallback } from "../controllers/authController.js";
import { optionalProtect } from "../middleware/optionalProtect.js";
import passport from "passport";
import { validate } from "../middleware/validate.js";
import { loginSchema, resetPasswordSchema, signupSchema } from "../validations/authValidation.js";


const router = express.Router();

router.post("/signup",validate(signupSchema), authController.signup);
router.post("/send-otp",optionalProtect, authController.sendOtp);
router.post("/verify-otp", authController.verifyotp);
router.post("/resend-otp", authController.resendotp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/forgot-password/verify-otp", authController.verifyForgotOtp);
router.post("/forgot-password/resend-otp", authController.resendForgotOtp); 
router.post("/reset-password",validate(resetPasswordSchema), authController.resetPassword);
router.post("/login",validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);

export default router;
