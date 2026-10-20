export const decodeJwt = (
  token: string
): { exp?: number; sub?: string; email?: string;[key: string]: unknown } => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return {};
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
};

/** Bearer explícito no escopo atual (ex.: refresh dentro do jwt callback). */
const bearerOverride = new AsyncLocalStorage<{ token: string | null }>();
/** Evita auth() → api → getServerToken → auth() em loop. */
const sessionLookup = new AsyncLocalStorage<boolean>();

/**
 * Define o Bearer para chamadas `api.*` dentro de `fn`, sem passar `token` em cada request.
 * Use no refresh do JWT (precisa do refreshToken, não do accessToken da sessão).
 */

export const withBearerToken = <T>(token: string | null,
  fn: () => Promise<T>): Promise<T> => {
  return bearerOverride.run({ token }, fn);
}

export const getServerToken = () => {
  // auth() só existe no servidor
  if (typeof window !== "undefined") return undefined;

  const override = bearerOverride.getStore();
  if (override) return override.token ?? undefined;

  // Já estamos resolvendo a sessão — não chamar auth() de novo
  if (sessionLookup.getStore()) return undefined;

  return sessionLookup.run(true, async () => {
    const { auth } = await import("@/auth");
    const session = await auth();
    return session?.accessToken;
  });
};