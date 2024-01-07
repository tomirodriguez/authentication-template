import { auth } from "@/server/auth";
import { cache } from "react";

/**
 *
 * @returns The user object from the session. If the user is not logged in, it will throw an error.
 * @throws Not authenticated if the user is not logged in.
 */
export const currentUser = cache(async () => {
  const session = await auth();

  if (!session) throw new Error("Not authenticated");

  return session.user;
});
