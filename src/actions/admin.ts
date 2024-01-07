"use server";

import { currentUser } from "@/lib/current-user";

/**
 *
 * @description This is based on jwt.
 * If you need to get a field that con change periodically, you should check de database.
 * The token won't be updated until the user logs out and logs in again.
 */
export const adminApi = async () => {
  const { role } = await currentUser();

  if (role !== "ADMIN")
    return {
      type: "error" as const,
      message: "Not allowed to see this content. Only for Admins.",
    };

  return { type: "success" as const, message: "Allowed to see this content!" };
};
