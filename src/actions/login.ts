"use server";

import type * as z from "zod";

import { LoginSchema } from "@/schemas/auth";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  return { success: "Confirmation email sent!" };
};
