import { logout } from "@/actions/auth/logout";

export const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <form>
      <button className="w-full" formAction={logout}>
        {children}
      </button>
    </form>
  );
};
