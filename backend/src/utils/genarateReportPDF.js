import PDFDocument from "pdfkit";

export const generatePDF = ({ title, rows = [], summary = {}, res }) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  let ended = false;
  const safeEnd = () => {
    if (!ended) {
      ended = true;
      doc.end();
    }
  };

  res.on("close", safeEnd);
  res.on("error", safeEnd);
  doc.on("error", safeEnd);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=${title.replace(/\s/g, "_")}.pdf`
  );

  doc.pipe(res);

  const LEFT = 50;
  const RIGHT = 560;
  const ROW_H = 18;

  doc.font("Times-Bold").fontSize(20).text(title, { align: "center" });
  doc.moveDown(1);

  const totalIncome = summary.income || 0;
  const totalExpense = summary.expense || 0;

  doc.font("Times-Roman").fontSize(12);
  doc.text(`Total Income  : Rs. ${totalIncome}`);
  doc.text(`Total Expense : Rs. ${totalExpense}`);
  doc.text(`Net Profit    : Rs. ${totalIncome - totalExpense}`);
  doc.moveDown(1);

  doc.font("Times-Bold").fontSize(10);

  let y = doc.y;

  doc.text("Period", LEFT, y);
  doc.text("Income", 220, y, { width: 80, align: "right" });
  doc.text("Expense", 320, y, { width: 80, align: "right" });

  doc.moveTo(LEFT, y + 14).lineTo(RIGHT, y + 14).stroke();

  doc.font("Times-Roman").fontSize(10);
  y += ROW_H;

  rows.forEach((r) => {
    if (y > 680) {
      doc.addPage();
      y = 50;
    }

    doc.text(r.label ?? "-", LEFT, y);
    doc.text(`Rs.${r.income ?? 0}`, 220, y, { width: 80, align: "right" });
    doc.text(`Rs.${r.expense ?? 0}`, 320, y, { width: 80, align: "right" });

    doc.moveTo(LEFT, y + ROW_H).lineTo(RIGHT, y + ROW_H).strokeOpacity(0.2);
    y += ROW_H;
  });


  const hasUserLevel = rows.length > 0 && "userId" in rows[0];

  if (hasUserLevel) {
    doc.addPage();

    doc.font("Times-Bold")
      .fontSize(14)
      .text("User-wise Quiz Participation Report", { align: "center" });

    doc.moveDown(1);

    const X = {
      date: 40,
      user: 95,
      contest: 155,
      fee: 285,
      reward: 335,
      refund: 385,
      status: 455,
    };

    y = doc.y;

    doc.font("Times-Bold").fontSize(9);
    doc.text("Date", X.date, y);
    doc.text("UserID", X.user, y);
    doc.text("Contest", X.contest, y);
    doc.text("Fee", X.fee, y, { width: 40, align: "right" });
    doc.text("Reward", X.reward, y, { width: 40, align: "right" });
    doc.text("Refund", X.refund, y, { width: 40, align: "right" });
    doc.text("Status", X.status, y);

    doc.moveTo(LEFT - 10, y + 14).lineTo(RIGHT, y + 14).stroke();

    doc.font("Times-Roman").fontSize(9);
    y += ROW_H;

    rows.forEach((r, i) => {
      if (y > 760) {
        doc.addPage();
        y = 50;
      }

      doc.text(r.label ?? "-", X.date, y);
      doc.text(`#${String(r.userId).slice(-5)}`, X.user, y);
      doc.text(r.contestTitle ?? "-", X.contest, y, { width: 120 });
      doc.text(`Rs.${r.entryFee ?? 0}`, X.fee, y, { width: 40, align: "right" });
      doc.text(`Rs.${r.reward ?? 0}`, X.reward, y, { width: 40, align: "right" });
      doc.text(`Rs.${r.refund ?? 0}`, X.refund, y, { width: 40, align: "right" });
      doc.text(r.status ?? "paid", X.status, y);

      doc.moveTo(LEFT - 10, y + ROW_H)
        .lineTo(RIGHT, y + ROW_H)
        .strokeOpacity(0.15);

      y += ROW_H;
    });
  }

  doc.moveDown(2);
  doc.fontSize(9).fillColor("gray");
  doc.text(`Generated on ${new Date().toDateString()}`, {
    align: "center",
  });

  safeEnd();
};
