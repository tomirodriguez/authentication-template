"use server";

import type * as z from "zod";

import { RegisterSchema } from "@/schemas/auth";
import * as bcrypt from "bcrypt";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });

  if (existingUser) {
    return { error: "User already exists!" };
  }

  await db.insert(users).values({
    id: email,
    email,
    name,
    password: hashedPassword,
  });

  // TODO: Send verification token email

  return { success: "Confirmation email sent!" };
};
