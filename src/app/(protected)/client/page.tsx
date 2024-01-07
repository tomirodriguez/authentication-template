"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ClientPage() {
  const user = useCurrentUser();

  return <UserInfo user={user} label="📱 Client component" />;
}
