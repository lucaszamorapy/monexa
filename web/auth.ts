import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { IAuthResponse } from "./app/utils/types/users";
import { Request } from "./app/utils/class/api";

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
          };
        } catch (error) {
          console.error("Falha no login (authorize):", error);
          return null;
        }
      },
    }),
  ],

});
