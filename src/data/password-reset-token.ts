import { db } from "@/server/db";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordToken = await db.query.passwordResetTokens.findFirst({
      where: (tokens, { eq }) => eq(tokens.identifier, email),
    });

    return passwordToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordToken = await db.query.passwordResetTokens.findFirst({
      where: (tokens, { eq }) => eq(tokens.token, token),
    });

    return passwordToken;
  } catch {
    return null;
  }
};
