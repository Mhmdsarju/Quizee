import asyncHandler from "express-async-handler";
import csv from "csv-parser";
import { Readable } from "stream";
import questionModel from "../../models/questionModel.js";
import { statusCode } from "../../constant/constants.js";
import AppError from "../../utils/AppError.js";

export const uploadQuestionsCSV = asyncHandler(async (req, res) => {
  const { quizId } = req.body;

  if (!quizId) {
    throw new AppError("quizId required", statusCode.BAD_REQUEST);
  }

  if (!req.file) {
    throw new AppError("CSV file required", statusCode.BAD_REQUEST);
  }

  const questions = [];

  await new Promise((resolve, reject) => {
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (row) => {
        // validation
        if (
          !row.question ||
          !row.optionA ||
          !row.optionB ||
          !row.optionC ||
          !row.optionD ||
          row.correctAnswer === undefined
        ) {
          stream.destroy();
          return reject(
            new AppError(
              "Invalid CSV format. Expected: question, optionA, optionB, optionC, optionD, correctAnswer",
              statusCode.BAD_REQUEST
            )
          );
        }

        const correctIndex = Number(row.correctAnswer);

        if (![0, 1, 2, 3].includes(correctIndex)) {
          stream.destroy();
          return reject(
            new AppError(
              "correctAnswer must be between 0 and 3",
              statusCode.BAD_REQUEST
            )
          );
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
      .on("end", resolve)
      .on("error", (err) =>
        reject(
          new AppError(
            `CSV parsing failed: ${err.message}`,
            statusCode.BAD_REQUEST
          )
        )
      );
  });

  if (questions.length === 0) {
    throw new AppError("No valid questions found in CSV", statusCode.BAD_REQUEST);
  }

  const existing = await questionModel.find(
    {
      quizId,
      question: { $in: questions.map((q) => q.question) },
    },
    { question: 1 }
  );

  const existingSet = new Set(existing.map((q) => q.question));

  const filteredQuestions = questions.filter(
    (q) => !existingSet.has(q.question)
  );

  if (filteredQuestions.length === 0) {
    throw new AppError(
      "All questions already exist",
      statusCode.CONFLICT
    );
  }

  await questionModel.insertMany(filteredQuestions);

  res.status(statusCode.CREATED).json({
    message: "CSV uploaded successfully",
    totalInserted: filteredQuestions.length,
    skippedDuplicates: questions.length - filteredQuestions.length,
  });
});
