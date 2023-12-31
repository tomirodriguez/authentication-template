"use server";

import type * as z from "zod";

import { RegisterSchema } from "@/schemas/auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  return { success: "Confirmation email sent!" };
};
