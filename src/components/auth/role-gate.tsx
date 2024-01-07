"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { type TUserRole } from "@/schemas/auth";
import { FormError } from "../form-error";

type TRoleGateProps = {
  allowedRoles: TUserRole;
};

export const RoleGate: React.FC<React.PropsWithChildren<TRoleGateProps>> = ({
  allowedRoles,
  children,
}) => {
  const { role } = useCurrentUser();

  if (role !== allowedRoles)
    return (
      <FormError message="You do not have permission to view this content!" />
    );

  return <>{children}</>;
};
