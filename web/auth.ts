import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { refreshApiToken } from "./app/_actions/auth";
import { IAuthResponse } from "./app/utils/types/users";
import { decodeJwt, withBearerToken } from "./app/utils/functions/auth";
import { Request } from "./app/utils/class/api";

// Map to prevent simultaneous in-flight refresh calls for the same token
const refreshLocks = new Map<string, Promise<JWT>>();

async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    return { ...token, error: "RefreshTokenError" };
  }

  try {
    // Escopo com refreshToken no Bearer — api.get sem passar token e sem reentrar em auth()
    const refreshed = await withBearerToken(token.refreshToken, () =>
      refreshApiToken()
    );
    const decoded = decodeJwt(refreshed.accessToken);

    const expiresAt =
      typeof decoded.exp === "number"
        ? decoded.exp * 1000
        : Date.now() + 3 * 60 * 60 * 1000;

    return {
      ...token,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken || token.refreshToken,
      accessTokenExpires: expiresAt,
      user: {
        id: refreshed.userId || token.user?.id || (token.sub as string),
        name: refreshed.name || token.user?.name || "",
        email: refreshed.email || token.user?.email || "",
        image: refreshed.image !== undefined ? refreshed.image : token.user?.image,
      },
      error: undefined,
    };
  } catch (error) {
    console.error("Erro ao renovar access token:", error);
    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
}

async function refreshAccessTokenWithLock(token: JWT): Promise<JWT> {
  const key = token.refreshToken;
  if (!key) {
    return { ...token, error: "RefreshTokenError" };
  }

  const existingLock = refreshLocks.get(key);
  if (existingLock) {
    return existingLock;
  }

  const refreshPromise = refreshAccessToken(token).finally(() => {
    refreshLocks.delete(key);
  });

  refreshLocks.set(key, refreshPromise);
  return refreshPromise;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const api = new Request("users/auth/login", {
          body: {
            email: credentials.email,
            password: credentials.password,
          }
        });
        try {
          const res = await api.post<IAuthResponse>();

          if (!res || !res.accessToken) {
            return null;
          }

          return {
            ...res,
            id: res.userId,
            message: res.message
          };
        } catch (error) {
          console.error("Falha no login (authorize):", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      // 1. Initial sign-in: capture user and tokens
      if (user) {
        const decoded = decodeJwt(user.accessToken);
        const expiresAt =
          typeof decoded.exp === "number"
            ? decoded.exp * 1000
            : Date.now() + 3 * 60 * 60 * 1000;

        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: expiresAt,
          user: {
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            image: user.image || null,
          },
        };
      }

      // 2. Explicit session update (e.g. user updated profile)
      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          ...session.user,
        };
        return token;
      }

      // 3. Already failed refresh — don't retry on every auth() call
      if (token.error === "RefreshTokenError") {
        return token;
      }

      // 4. If access token is still valid (with 60-second safety margin)
      const expiresAt = token.accessTokenExpires;
      if (
        typeof expiresAt === "number" &&
        Date.now() < expiresAt - 60 * 1000
      ) {
        return token;
      }

      // 5. Access token has expired (or expiry unknown), refresh it
      return refreshAccessTokenWithLock(token);
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image,
        };
      }
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
});
