import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").regex(/^[A-Za-z0-9]+$/,"Name can contain only letters and numbers").max(15,"name should be less than 9 characters "),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").regex(/^\S+$/, "Password cannot contain spaces"),
  referralCode:z.string().optional(),
});
