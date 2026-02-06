import { z } from "zod";

export const contestSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters"),

    quiz: z.string().optional(),

    entryFee: z
      .number({ invalid_type_error: "Entry fee is required" })
      .positive("Entry fee must be greater than 0"),

    prizeFirst: z
      .number({ invalid_type_error: "1st prize is required" })
      .positive("1st prize must be greater than 0"),

    prizeSecond: z
      .number({ invalid_type_error: "2nd prize is required" })
      .positive("2nd prize must be greater than 0"),

    prizeThird: z
      .number({ invalid_type_error: "3rd prize is required" })
      .positive("3rd prize must be greater than 0"),

    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })

  .refine(
    (data) => {
      const now = new Date();
      const start = new Date(data.startTime);
      return start >= now;
    },
    {
      path: ["startTime"],
      message: "Start time must be in the future",
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end > start;
    },
    {
      path: ["endTime"],
      message: "End time must be after start time",
    }
  )

  .refine(
    (data) =>
      data.prizeFirst > data.prizeSecond &&
      data.prizeSecond > data.prizeThird,
    {
      path: ["prizeThird"],
      message: "Prize order must be: 1st > 2nd > 3rd",
    }
  );
