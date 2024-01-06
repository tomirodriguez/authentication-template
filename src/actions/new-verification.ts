"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/server/db";
import { users, verificationTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const newVerification = async (token: string) => {
  if (!token) return { error: "No token provided!" };

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) return { error: "Email does not exist!" };

  await Promise.all([
    db
      .update(users)
      .set({ emailVerified: new Date(), email: existingToken.identifier })
      .where(eq(users.id, existingUser.id)),
    db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, existingToken.identifier)),
  ]);

  return { success: "Email verified!" };
};
