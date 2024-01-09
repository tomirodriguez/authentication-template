"use server";

import { currentUser } from "@/lib/current-user";
import { SettingsSchema } from "@/schemas/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { type z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) return { type: "error" as const, message: "User not found!" };

  const validSettings = SettingsSchema.safeParse(values);

  if (!validSettings.success)
    return { type: "error" as const, message: validSettings.error.message };

  if (user.provider === "credentials") {
    if (!values.password)
      return { type: "error" as const, message: "Invalid password!" };

    const dbUser = await db.query.users.findFirst({
      columns: { password: true },
      where: (users, { eq }) => eq(users.id, user.id),
    });

    if (!dbUser) return { type: "error" as const, message: "User not found!" };

    if (dbUser.password) {
      const isValidPassword = await bcrypt.compare(
        values.password,
        dbUser.password,
      );

      if (!isValidPassword)
        return { type: "error" as const, message: "Invalid password!" };
    }
  }

  const updated = await db
    .update(users)
    .set(values)
    .where(eq(users.id, user.id));

  if (updated.rowsAffected === 0)
    return { type: "error" as const, message: "User not found!" };

  revalidatePath("/server");

  return { type: "success" as const, message: "Settings updated!" };
};
