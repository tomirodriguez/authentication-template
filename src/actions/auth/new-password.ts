"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas/auth";
import { db } from "@/server/db";
import { users, verificationTokens } from "@/server/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { type z } from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string,
) => {
  if (!token) return { error: "No token provided!" };

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid password" };

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) return { error: "Email does not exist!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await Promise.all([
    db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, existingUser.id)),
    db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, existingToken.identifier)),
  ]);

  return { success: "Password updated!" };
};
