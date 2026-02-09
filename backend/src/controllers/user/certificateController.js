import path from "path";
import { sendCertificateEmail } from "../../utils/sendCertificateEmail.js";

export const sendExistingCertificateController = async (req, res) => {
  try {
    const { certificateUrl } = req.body;

    if (!certificateUrl) {
      return res.status(400).json({ message: "certificateUrl missing" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
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
  } catch (err) {
    console.error("MAIL ERROR ", err);
    res.status(500).json({ message: "Failed to send certificate" });
  }
};
