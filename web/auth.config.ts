import type { NextAuthConfig } from "next-auth";
import { refreshApiToken } from "./app/_actions/users";
import { decodeJwt } from "./app/utils/functions/auth";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // Login inicial
      if (user && account) {
        const decoded = decodeJwt(user.accessToken);
        return {
          ...token,
          sub: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: decoded?.exp ? decoded.exp * 1000 : 0,
        };
      }

      // Token ainda válido
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token expirado: tenta renovar
      try {
        const refreshed = await refreshApiToken(token.refreshToken);
        const decoded = decodeJwt(refreshed.accessToken);

        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          accessTokenExpires: decoded?.exp ? decoded.exp * 1000 : 0,
          error: undefined,
        };
      } catch (error) {
        console.error("Erro ao renovar token", error);
        return { ...token, error: "RefreshTokenError" as const };
      }
    },

    session: async ({ session, token }) => {
      // Esse callback roda SEMPRE que o frontend chama:
      // - useSession()
      // - getServerSession()
      // - auth()
      // Aqui transformamos o JWT (token)
      // em um objeto "session" seguro para o frontend

      // Expondo o id do usuário no session.user
      // Expondo o accessToken para o frontend
      // (ok expor, pois ele expira rápido)
      session.user.id = token.sub as string;
      session.accessToken = token.accessToken as string;
      session.error = token.error;
      // NUNCA exponha o refreshToken aqui
      // Ele deve ficar somente no JWT (server-side)
      return session;
    }
  },
  providers: [],
};
