import asyncHandler from "express-async-handler";
import path from "path";
import { sendCertificateEmail } from "../../utils/sendCertificateEmail.js";
import AppError from "../../utils/AppError.js";
import { statusCode } from "../../constant/constants.js";

export const sendExistingCertificateController = asyncHandler(async (req, res) => {
  const { certificateUrl } = req.body;

  if (!certificateUrl) {
    throw new AppError("certificateUrl missing",statusCode.BAD_REQUEST);
  }

  if (!req.user) {
    throw new AppError("Unauthorized",statusCode.UNAUTHORIZED);
  }

  const filePath = path.join(
    process.cwd(),
    "uploads",
    "certificates",
    path.basename(certificateUrl)
  );

  await sendCertificateEmail({
    to: req.user.email,
    name: req.user.name,
    filePath,
  });

  res.json({ message: "Certificate sent to email" });
});
