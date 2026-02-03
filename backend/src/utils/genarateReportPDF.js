import PDFDocument from "pdfkit";

export const generatePDF = ({ title, rows, summary, res }) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=${title.replace(/\s/g, "_")}.pdf`
  );

  doc.pipe(res);

  const PAGE_WIDTH = doc.page.width;
  const PAGE_HEIGHT = doc.page.height;
  const LEFT = 60;
  const RIGHT = PAGE_WIDTH - 60;

  doc
    .lineWidth(2)
    .rect(25, 25, PAGE_WIDTH - 50, PAGE_HEIGHT - 50)
    .stroke("#4f46e5");

  doc
    .fontSize(12)
    .fillColor("#666")
    .text("OFFICIAL FINANCIAL REPORT FROM QUIZEEE", 0, 70, {
      align: "center",
    });

  doc.moveDown(0.5);

  doc
    .font("Times-Bold")
    .fontSize(24)
    .fillColor("#111")
    .text(title.toUpperCase(), {
      align: "center",
    });

  doc.moveDown(1.5);

  const boxTop = doc.y;

  doc
    .roundedRect(LEFT, boxTop, RIGHT - LEFT, 95, 10)
    .stroke("#4f46e5");

  doc.font("Times-Roman").fontSize(13).fillColor("#000");

  doc.text(`Total Income  : Rs. ${summary.income}`, LEFT + 30, boxTop + 20);
  doc.text(`Total Expense : Rs. ${summary.expense}`, LEFT + 30, boxTop + 45);

  doc
    .font("Times-Bold")
    .text(
      `Net Profit    : Rs. ${summary.income - summary.expense}`,
      LEFT + 30,
      boxTop + 70
    );

  doc.moveDown(6);

  doc
    .font("Times-Bold")
    .fontSize(14)
    .fillColor("#4f46e5")
    .text("REPORT DETAILS", {
      align: "center",
    });

  doc.moveDown(1);

  const colPeriod = LEFT;
  const colIncome = LEFT + 220;
  const colExpense = LEFT + 360;

  doc.font("Times-Bold").fontSize(11).fillColor("#000");

  const headerY = doc.y;

  doc.text("Period", colPeriod, headerY, { width: 200 });
  doc.text("Income", colIncome, headerY, {
    width: 80,
    align: "right",
  });
  doc.text("Expense", colExpense, headerY, {
    width: 80,
    align: "right",
  });

  doc
    .moveTo(LEFT, headerY + 15)
    .lineTo(RIGHT, headerY + 15)
    .stroke();

  doc.moveDown(1.5);

  doc.font("Times-Roman").fontSize(11);

  rows.forEach((row) => {
    if (doc.y > PAGE_HEIGHT - 120) {
      doc.addPage();
    }

    const y = doc.y;

    doc.text(row.label, colPeriod, y, { width: 200 });

    doc.text(`Rs. ${row.income}`, colIncome, y, {
      width: 80,
      align: "right",
    });

    doc.text(`Rs. ${row.expense}`, colExpense, y, {
      width: 80,
      align: "right",
    });

    doc.moveDown(1);
  });

  const footerY = PAGE_HEIGHT - 80;

  doc
    .fontSize(10)
    .fillColor("#666")
    .text(`Generated on: ${new Date().toDateString()}`, LEFT, footerY);

  doc
    .font("Times-Bold")
    .fillColor("#000")
    .text("QUIZEE FINANCE SYSTEM", LEFT, footerY, {
      width: RIGHT - LEFT,
      align: "right",
    });

  doc.end();
};
