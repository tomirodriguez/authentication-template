import * as z from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "USER"]);

export type TUserRole = z.infer<typeof UserRoleSchema>;

const EmailSchema = z.string().email({
  message: "Email is required",
});

const PasswordSchema = z.string().min(6, {
  message: "Minimum 6 characters required",
});

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  code: z.optional(z.string()),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: UserRoleSchema,
    email: z.optional(EmailSchema),
    password: PasswordSchema,
    newPassword: PasswordSchema,
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );

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
