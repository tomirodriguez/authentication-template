"use server";

import { currentUser } from "@/lib/current-user";

export const adminApi = async () => {
  const { role } = await currentUser();

  if (role !== "ADMIN")
    return {
      type: "error" as const,
      message: "Not allowed to see this content. Only for Admins.",
    };

  return { type: "success" as const, message: "Allowed to see this content!" };
};
