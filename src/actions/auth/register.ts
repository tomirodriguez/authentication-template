"use server";

import type * as z from "zod";
import { RegisterSchema } from "@/schemas/auth";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "User already exists!" };
  }

  await db.insert(users).values({
    id: crypto.randomUUID(),
    email,
    name,
    password: hashedPassword,
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(
    verificationToken.identifier,
    verificationToken.token,
  );

  return { success: "Confirmation email sent!" };
};
