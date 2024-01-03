import { getUserByEmail, getUserById } from "@/data/user";
import { LoginSchema, type TUserRole } from "@/schemas/auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { mysqlTable } from "./db/schema";

declare module "next-auth" {
  interface User {
    role?: TUserRole;
  }
  interface Session extends DefaultSession {
    user: User;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (!token.sub) return token;

      if (user) {
        token.role = user.role;
      }

      if (!token.role) {
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;

        token.role = existingUser.role;
      }

      return token;
    },
    session({ token, session }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role as TUserRole;
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          if (!user?.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
});
