import { getServerToken } from "../../functions/auth";
import { FetchOptions, IApiError } from "../../types/global";

export class Request {
  completePath: string;
  options?: FetchOptions;

  constructor(path: string, options?: FetchOptions) {
    this.completePath = `${process.env.NEXT_PUBLIC_API_URL}/${path}`
    this.options = options
  }

  private async execute<T>(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"): Promise<T> {
    const { body, token, headers, ...init } = this.options ?? {}

    const isFormData = body instanceof FormData;
    // undefined => pega da sessão | null => requisição pública (login, cadastro)
    const accessToken = token === undefined ? await getServerToken() : token;

    const response = await fetch(this.completePath, {
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