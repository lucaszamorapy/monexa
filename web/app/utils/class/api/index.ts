import { getServerToken } from "../../functions/auth";
import { FetchOptions, IApiError } from "../../types/global";

export class Request {
  completePath: string;
  options?: FetchOptions;

  constructor(path: string, options?: FetchOptions) {
    this.completePath = `${process.env.NEXT_PUBLIC_API_URL}/${path}`
    this.options = options
  }

  private getUrl(): string {
    const queryParams = this.options?.params ?? this.options?.query;
    if (!queryParams) return this.completePath;

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined || value === null || value === "") continue;

      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined && item !== null && item !== "") {
            searchParams.append(key, String(item));
          }
        }
      } else {
        searchParams.append(key, String(value));
      }
    }

    const queryString = searchParams.toString();
    if (!queryString) return this.completePath;

    const separator = this.completePath.includes("?") ? "&" : "?";
    return `${this.completePath}${separator}${queryString}`;
  }

  private async execute<T>(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"): Promise<T> {
    const { body, token, headers, ...init } = this.options ?? {}

    const isFormData = body instanceof FormData;
    // undefined => pega da sessão | null => requisição pública (login, cadastro)
    const accessToken = token === undefined ? await getServerToken() : token;

    const url = this.getUrl();

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
        !body ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });

    const data = response.status === 204 ? null : await response.json()

    if (!response.ok) {
      if (this.isApiError(data)) {
        console.error(`${data.code}: ${data.error}`)
        throw new Error(data.error ?? "Ocorreu um erro inesperado. Tente novamente.");
      }
      else {
        console.error(data.message)
        throw new Error(data.message ?? "Ocorreu um erro inesperado. Tente novamente.");
      }
    }

    return data as T;
  }

  async get<T>() {
    return await this.execute<T>("GET")
  }

  async post<T>() {
    return await this.execute<T>("POST")
  }

  async put<T>() {
    return await this.execute<T>("PUT")
  }

  async patch<T>() {
    return await this.execute<T>("PATCH")
  }

  async path<T>() {
    return await this.execute<T>("PATCH")
  }

  async delete<T>() {
    return await this.execute<T>("DELETE")
  }

  isApiError(data: unknown): data is IApiError {
    return (
      typeof data === "object" &&
      data !== null &&
      "code" in data &&
      "error" in data
    );
  }

}
