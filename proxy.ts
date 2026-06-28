
import { auth } from "@/app/lib/auth.config";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // Protect landingPage and video api endpoints
    const isProtectedRoute = pathname === "/landingPage" || pathname.startsWith("/api/videos");

    if (isProtectedRoute && !isLoggedIn) {
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect logged-in users away from auth pages
    const isAuthPage = pathname === "/login" || pathname === "/register";
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/landingPage", req.url));
    }
});

export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};