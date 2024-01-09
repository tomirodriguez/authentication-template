import * as z from "zod";

export type TUserRole = z.infer<typeof UserRoleSchema>;

export const UserRoleSchema = z.enum(["ADMIN", "USER"]);

const EmailSchema = z.string().email({
  message: "Email is required",
});

const PasswordSchema = z.string().min(6, {
  message: "Minimum 6 characters required",
});

const NameSchema = z.string().min(1, {
  message: "Name is required",
});

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: NameSchema,
});

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  code: z.optional(z.string()),
});

export const SettingsSchema = z.object({
  name: z.optional(NameSchema),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.optional(UserRoleSchema),
  email: z.optional(EmailSchema),
  password: z.optional(PasswordSchema),
  // newPassword: PasswordSchema,
});

export const NewPasswordSchema = z
  .object({
    password: PasswordSchema,
    passwordConfirmation: PasswordSchema,
  })
  .refine(
    (data) => {
      if (data.password !== data.passwordConfirmation) return false;

      return true;
    },
    { message: "Passwords do not match", path: ["passwordConfirmation"] },
  );

export const ResetSchema = z.object({
  email: EmailSchema,
});
