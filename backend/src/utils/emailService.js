import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"QUIZEE" <${process.env.EMAIL}>`,
    to: email,
    subject: "Email Verification OTP From Quizee",
    text: `Your OTP is ${otp}. This OTP is valid for 60 seconds.`
  });
};
