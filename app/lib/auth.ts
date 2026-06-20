import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { connectDB } from "./db";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { authConfig } from "./auth.config";

export const authOptions: NextAuthConfig = {
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email = credentials?.email as string | undefined;
                const password = credentials?.password as string | undefined;

                if (!email || !password) {
                    throw new Error("Missing email or password");
                }
                try {
                    await connectDB();
                    const user = await prisma.user.findUnique({
                        where: { email }
                    });
                    if (!user) {
                        throw new Error("User not found");
                    }
                    if (!user.password) {
                        throw new Error("Please sign in using Google or GitHub");
                    }
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
                    return {
                        id: String(user.id),
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            if (account?.provider === "google" || account?.provider === "github") {
                const email = user.email;
                if (!email) {
                    console.error("OAuth signin failed: Missing email");
                    return false;
                }
                try {
                    await connectDB();
                    const existingUser = await prisma.user.findUnique({
                        where: { email }
                    });
                    if (!existingUser) {
                        const newUser = await prisma.user.create({
                            data: {
                                name: user.name || email.split("@")[0],
                                email: email,
                            }
                        });
                        user.id = String(newUser.id);
                    } else {
                        user.id = String(existingUser.id);
                    }
                    return true;
                } catch (error) {
                    console.error("Error signing in / registering OAuth user:", error);
                    return false;
                }
            }
            return true;
        }
    }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);