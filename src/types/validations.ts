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

export type EmailInput = {
  email?: string;
};

export const emailSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
});

export type EmailAndOtpInput = EmailInput & {
  otp?: string;
};

export const emailAndOtpSchema = emailSchema
  .extend({
    otp: z.string().min(6, { message: "OTP is required" }),
  })
  .refine((data) => /^\d+$/.test(data.otp), {
    message: "OTP should only contain digits",
    path: ["otp"],
  });

export type RegisterInputs = EmailAndOtpInput & {
  password?: string;
  confirmPassword?: string;
};

export const registerSchema = emailSchema
  .extend({
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
