import * as z from "zod";

// TODO: Unified repeated schemas

export const UserRoleSchema = z.enum(["ADMIN", "USER"]);

export type TUserRole = z.infer<typeof UserRoleSchema>;

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: UserRoleSchema,
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
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
    password: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    passwordConfirmation: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine(
    (data) => {
      if (data.password !== data.passwordConfirmation) return false;

      return true;
    },
    { message: "Passwords do not match", path: ["passwordConfirmation"] },
  );

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
