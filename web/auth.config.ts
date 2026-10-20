import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (matching refresh token expiration)
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user && auth?.error !== "RefreshTokenError";
      const isPublicRoute =
        nextUrl.pathname === "/auth/login" ||
        nextUrl.pathname === "/auth/signup";

      if (isPublicRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // If user is trying to access protected route without valid session
      return isLoggedIn;
    },
  },
  providers: [],
};
