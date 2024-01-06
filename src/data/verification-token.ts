import { db } from "@/server/db";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: (tokens, { eq }) => eq(tokens.identifier, email),
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: (tokens, { eq }) => eq(tokens.token, token),
    });

    return verificationToken;
  } catch {
    return null;
  }
};
