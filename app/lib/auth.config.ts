import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";

export const authConfig = {
    providers: [], // Empty array, we will define provider logic in auth.ts
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "USER" | "ADMIN";
            }
            return session;
        },
    },
    pages: {
        signIn: "/register",
        error: "/register",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { auth } = NextAuth(authConfig);
