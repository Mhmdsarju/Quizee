import csv from "csv-parser";
import { Readable } from "stream";
import questionModel from "../../models/questionModel.js";


export const uploadQuestionsCSV = async (req, res) => {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: "quizId required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const questions = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (row) => {
        // 🛑 validation
        if (
          !row.question ||
          !row.optionA ||
          !row.optionB ||
          !row.optionC ||
          !row.optionD ||
          row.correctAnswer === undefined
        ) {
          throw new Error("Invalid CSV format");
        }

        const correctIndex = Number(row.correctAnswer);

        if (![0, 1, 2, 3].includes(correctIndex)) {
          throw new Error("correctAnswerIndex must be 0-3");
        }

        questions.push({
          quizId:quizId,
          question: row.question,
          options: [
            row.optionA,
            row.optionB,
            row.optionC,
            row.optionD,
          ],
          correctAnswer: correctIndex,
        });
      })
      .on("end", async () => {
        await questionModel.insertMany(questions);

        res.status(201).json({
          message: "CSV uploaded successfully",
          totalQuestions: questions.length,
        });
      });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
