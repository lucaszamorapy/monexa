import { type DefaultSession } from "next-auth";
import { type JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    accessToken: string;
    refreshToken: string;
  }

  /**
   * The shape of the `session` callback's returned object.
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    } & DefaultSession["user"];
    accessToken?: string;
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `auth`, when using JWT sessions
   */
  interface JWT extends DefaultJWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: "RefreshTokenError";
    user?: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    };
  }
}
