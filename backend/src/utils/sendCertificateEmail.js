import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendCertificateEmail = async ({ to, name, filePath }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"QUIZEE" <${process.env.EMAIL}>`, 
    to,
    subject: "🎉 Your Quiz Certificate",
    html: `
      <p>Hi <b>${name}</b>,</p>
      <p>Congratulations on your achievement! 🏆</p>
      <p>Your certificate is attached below.</p>
      <br/>
      <p>– QUIZEE Team</p>
    `,
    attachments: [
      {
        filename: "certificate.pdf",
        path: filePath,
      },
    ],
  });
};
