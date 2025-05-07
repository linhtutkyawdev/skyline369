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
    otp: z.string().min(6, { message: "OTP needs to be 6 digits" }),
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
    otp: z.string().min(6, { message: "OTP is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(15, { message: "Password must be at most 15 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/, {
        message:
          "Password must contain letters, numbers, and at least one uppercase letter",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for the final step of password reset (using token)
export const passwordResetSchema = z
  .object({
    email: z.string().email().min(1, { message: "Email is required" }),
    // Removed token field from schema
    newPassword: z
      .string()
      .min(8, { message: "New password is too short" })
      .max(20, { message: "New password is too long" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });
// Removed refine check comparing current and new password

export type PasswordResetInputs = z.infer<typeof passwordResetSchema>;
