import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/server/db";
import { passwordResetTokens, verificationTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();

  // Expire token en 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, existingToken.token));
  }

  await db.insert(verificationTokens).values({
    identifier: email,
    token,
    expires,
  });

  return {
    identifier: email,
    token,
    expires,
  };
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();

  // Expire token en 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.token, existingToken.token));
  }

  await db.insert(passwordResetTokens).values({
    identifier: email,
    token,
    expires,
  });

  return {
    identifier: email,
    token,
    expires,
  };
};
