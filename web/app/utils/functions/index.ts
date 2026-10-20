import { FetchOptions } from "../types/global";

export const getApiUrl = () => {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8082"
  );
};

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

const getServerToken = async () => {
  // auth() só existe no servidor
  if (typeof window !== "undefined") return undefined;

  const { auth } = await import("@/auth");
  const session = await auth();
  return session?.accessToken;
};


const request = async <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  { body, token, headers, ...init }: FetchOptions = {},
): Promise<T> => {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const baseUrl = getApiUrl().replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  const url = `${baseUrl}/${cleanPath}`;

  // undefined => pega da sessão | null => requisição pública (login, cadastro)
  const accessToken = token === undefined ? await getServerToken() : token;

  const response = await fetch(url, {
    ...init,
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && !isFormData
        ? { "Content-Type": "application/json" }
        : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data =
    response.status === 204
      ? null
      : contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text();

  if (!response.ok) {
    const err = data as { code?: string; error?: string } | string | null;
    if (err && typeof err === "object") {
      throw new Error(`${err.code ?? response.status}: ${err.error ?? "Erro na requisição"}`);
    }
    throw new Error(`${response.status}: ${err || "Erro na requisição"}`);
  }

  return data as T;
};

export const api = {
  get: <T>(path: string, options?: FetchOptions) =>
    request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>("POST", path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>("PUT", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: FetchOptions) =>
    request<T>("DELETE", path, options),
};


export const toFormData = (data: Record<string, unknown>) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, String(item)));
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
};
