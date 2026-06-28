import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role?: "USER" | "ADMIN";
        } & DefaultSession["user"]
    }

    interface User {
        role?: "USER" | "ADMIN";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "USER" | "ADMIN";
    }
}