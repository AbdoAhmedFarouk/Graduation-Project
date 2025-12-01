"use server";

import z from "zod";
import { signupValidationSchema } from "../_validators/form-validation";

interface PrevStateTypes {
  success: boolean;
  message?: string;
}

const BACKEND_URL = process.env.URI;

export const signup = async (prevState: PrevStateTypes, formData: FormData) => {
  const values = Object.fromEntries(formData.entries());
  const parsed = signupValidationSchema.safeParse(values);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    const message =
      errors.firstName?.[0] ||
      errors.lastName?.[0] ||
      errors.email?.[0] ||
      errors.password?.[0] ||
      "Invalid input";
    return { success: false, message };
  }

  const { firstName, lastName, email, password } = parsed.data;

  const res = await fetch(`http://localhost:5000/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  console.log(res);

  return res.ok
    ? { success: true }
    : { success: false, message: "Signup failed" };

  // ⚠️⚠️ Don't forget directing the user
  // return { success: true };
};

// export const login = async (formData: FormData) => {
//   const email = formData.get("email");
//   const password = formData.get("password");
// };
