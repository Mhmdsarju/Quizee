import {z} from "zod";

export const contestSchema=z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters"),

    quiz: z.string().optional(),

    entryFee: z
      .number({ invalid_type_error: "Entry fee is required" })
      .min(0, "Entry fee cannot be negative"),

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
  );