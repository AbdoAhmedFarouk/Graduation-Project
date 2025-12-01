import * as z from "zod";

export const signupValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First Name must be at least 1 character long" }),
  lastName: z
    .string()
    .min(1, { message: "Last Name must be at least 1 character long" }),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// export type SignupSchema = z.infer<typeof signupValidationSchema>;
