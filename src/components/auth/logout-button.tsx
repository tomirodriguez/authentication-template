import { logout } from "@/actions/logout";

export const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <form>
      <button className="w-full" formAction={logout}>
        {children}
      </button>
    </form>
  );
};
