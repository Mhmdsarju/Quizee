import csv from "csv-parser";
import { Readable } from "stream";
import questionModel from "../../models/questionModel.js";
import { statusCode } from "../../constant/constants.js";


export const uploadQuestionsCSV = async (req, res) => {
  const { quizId } = req.body;

  if (!quizId) {
    return res.status(statusCode.BAD_REQUEST).json({ message: "quizId required" });
  }

  if (!req.file) {
    return res.status(statusCode.BAD_REQUEST).json({ message: "CSV file required" });
  }

  const questions = [];
  const stream = Readable.from(req.file.buffer);

  let hasError = false;

  stream
    .pipe(csv())
    .on("data", (row) => {
      if (hasError) return;

      // validation
      if (
        !row.question ||
        !row.optionA ||
        !row.optionB ||
        !row.optionC ||
        !row.optionD ||
        row.correctAnswer === undefined
      ) {
        hasError = true;
        stream.destroy();
        return res.status(statusCode.BAD_REQUEST).json({
          message: "Invalid CSV format",
          expectedFormat:
            "question, optionA, optionB, optionC, optionD, correctAnswer",
        });
      }

      const correctIndex = Number(row.correctAnswer);

      if (![0, 1, 2, 3].includes(correctIndex)) {
        hasError = true;
        stream.destroy();
        return res.status(statusCode.BAD_REQUEST).json({
          message: "correctAnswer must be between 0 and 3",
        });
      }

      questions.push({
        quizId,
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
      if (hasError) return;

      const existing = await questionModel.find(
        {
          quizId,
          question: { $in: questions.map(q => q.question) },
        },
        { question: 1 }
      );

      const existingSet = new Set(existing.map(q => q.question));

      const filteredQuestions = questions.filter(
        q => !existingSet.has(q.question)
      );

      if (filteredQuestions.length === 0) {
        return res.status(statusCode.CONFLICT).json({
          message: "All questions already exist",
        });
      }

      await questionModel.insertMany(filteredQuestions);

      res.status(statusCode.CREATED).json({
        message: "CSV uploaded successfully",
        totalInserted: filteredQuestions.length,
        skippedDuplicates: questions.length - filteredQuestions.length,
      });
    })
.on("error", (err) => {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "CSV parsing failed",
        error: err.message,
      });
    });
};
