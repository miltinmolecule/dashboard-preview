import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import axios from "axios";
import { API_URLS } from "./api-urls";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const { data } = await axios.post(API_URLS.AUTH.LOGIN, {
            login: parsed.data.email,
            password: parsed.data.password,
          });

          const { accessToken, refreshToken, ...rest} = data.data;

          return {
            ...rest,
            accessToken,
            refreshToken,
          };
        } catch(error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as Record<string, unknown>).role as string;
        token.accessToken = (user as Record<string, unknown>).accessToken as string;
        token.refreshToken = (user as Record<string, unknown>).refreshToken as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.role = token.role as string | undefined;
        session.accessToken = token.accessToken as string | undefined;
        session.refreshToken = token.refreshToken as string | undefined;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authConfig);
