import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateCertificate = ({ name, contestTitle, rank }) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 40,
    });

    const fileName = `certificate-${Date.now()}.pdf`;
    const dirPath = path.join(process.cwd(), "uploads/certificates");
    const filePath = path.join(dirPath, fileName);

    fs.mkdirSync(dirPath, { recursive: true });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    /* =========================
       BORDER
    ========================= */
    doc
      .lineWidth(4)
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .stroke("#C9A14A");

    doc
      .lineWidth(1)
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .stroke("#000");

    /* =========================
       HEADER
    ========================= */
    doc
      .fontSize(12)
      .fillColor("#999")
      .text("OFFICIAL DOCUMENT FROM QUIZEE", 0, 60, { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(36)
      .fillColor("#111")
      .font("Times-Bold")
      .text("CERTIFICATE OF", { align: "center" });

    doc
      .fontSize(34)
      .text("ACHIEVEMENT", { align: "center" });

    /* =========================
       BODY
    ========================= */
    doc.moveDown(1.5);

    doc
      .fontSize(14)
      .fillColor("#666")
      .font("Times-Roman")
      .text("THIS CERTIFIES THAT", { align: "center" });

    doc.moveDown(0.8);

    doc
      .fontSize(42)
      .fillColor("#C57B2A")
      .font("Times-Italic")
      .text(name, { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(16)
      .fillColor("#333")
      .font("Times-Roman")
      .text("has successfully secured", { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(22)
      .font("Times-Bold")
      .text(`RANK #${rank}`, { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(16)
      .font("Times-Roman")
      .text(`in the contest "${contestTitle}"`, { align: "center" });

    /* =========================
       FOOTER
    ========================= */
    const bottomY = doc.page.height - 130;

    // Issued by
    doc
      .fontSize(11)
      .fillColor("#666")
      .text("Issued By :", 120, bottomY - 20);

    // QUIZEEE TEAM
    doc
      .fontSize(12)
      .fillColor("#333")
      .font("Times-Bold")
      .text("QUIZEE TEAM", 120, bottomY + 8);

    // Date
    doc
      .fontSize(12)
      .font("Times-Roman")
      .text(
        `Date: ${new Date().toDateString()}`,
        doc.page.width - 320,
        bottomY + 8
      );

    /* =========================
       WINNER BADGE (FIXED)
    ========================= */
    const badgeX = doc.page.width - 120;
    const badgeY = 110;
    const badgeRadius = 40;

    doc
      .circle(badgeX, badgeY, badgeRadius)
      .fill("#C9A14A");

    doc
      .fillColor("#fff")
      .fontSize(14)
      .font("Times-Bold")
      .text(
        "WINNER",
        badgeX - badgeRadius,
        badgeY - 7,
        {
          width: badgeRadius * 2,
          align: "center",
        }
      );

    doc.end();

    stream.on("finish", () => {
      resolve(`/certificates/${fileName}`);
    });
  });
};
