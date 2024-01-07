import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

/**
 *
 * @returns The user object from the session. If the user is not logged in, it will redirect to the login page.
 */
export const useCurrentUser = () => {
  const session = useSession();

  if (!session.data?.user) redirect("/auth/login");

  return session.data.user;
};
