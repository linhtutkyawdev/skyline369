import { z } from "zod"; // Add new import

export type LoginInputs = {
  email?: string;
  password?: string;
};

export const loginSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password is too short" })
    .max(20, { message: "Password is too long" }),
});

export type ForgotPasswordInputs = {
  email?: string;
};

export const forgotPasswordSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
});

export type RegisterInputs = {
  fullname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export const registerSchema = z
  .object({
    email: z.string().email().min(1, { message: "Email is required" }),
    otp: z.string().min(6, { message: "OTP is required" }),
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => /^\d+$/.test(data.otp), {
    message: "OTP should only contain digits",
    path: ["otp"],
  });
