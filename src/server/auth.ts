import "server-only";

import { env } from "@/env";
import { LoginSchema, type TUserRole } from "@/schemas/auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { mysqlTable, users } from "./db/schema";

type ExtendedUser = DefaultSession["user"] & {
  name: string;
  email: string;
  role: TUserRole;
  provider: "google" | "github" | "credentials";
};

declare module "next-auth" {
  interface User {
    role?: TUserRole;
  }
  interface Session {
    user: ExtendedUser;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow 0Auth without email verification
      if (account?.provider !== "credentials") return true;

      try {
        const dbUser = await db.query.users.findFirst({
          columns: { emailVerified: true },
          where: (dbUser, { eq }) => eq(dbUser.id, user.id),
        });

        if (!dbUser) return false;

        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, user, trigger, account }) {
      const { sub: id } = token;
      if (!id) return token;

      if (user) {
        token.role = user.role;
      }

      if (account) {
        console.log(account.provider);
        token.provider = account.provider;
      }

      if (!token.role) {
        try {
          const dbUser = await db.query.users.findFirst({
            columns: { role: true },
            where: (user, { eq }) => eq(user.id, id),
          });

          if (!dbUser) return token;

          token.role = dbUser.role;
        } catch {
          return token;
        }
      }

      if (trigger === "update") {
        try {
          const dbUser = await db.query.users.findFirst({
            columns: { role: true, email: true, name: true, image: true },
            where: (user, { eq }) => eq(user.id, id),
          });

          if (!dbUser) return token;

          token.role = dbUser.role;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        } catch {
          return token;
        }
      }

      return token;
    },
    session({ token, session }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role as ExtendedUser["role"];
      }

      if (session.user && token.provider) {
        session.user.provider = token.provider as ExtendedUser["provider"];
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        try {
          const user = await db.query.users.findFirst({
            where: (user, { eq }) => eq(user.email, email),
          });

          if (!user?.password) return null;

          const { password: userPassword, ...userWithoutPassword } = user;

          const passwordsMatch = await bcrypt.compare(password, userPassword);
          if (passwordsMatch) return userWithoutPassword;

          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
});
