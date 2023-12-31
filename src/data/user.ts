import { db } from "@/server/db";
import { z } from "zod";

const emailSchema = z.string().email();

export const getUserByEmail = async (email: string) => {
  try {
    const verifiedEmail = emailSchema.safeParse(email);

    if (!verifiedEmail.success) return null;

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, verifiedEmail.data),
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });

    return user;
  } catch {
    return null;
  }
};
