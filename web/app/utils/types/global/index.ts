type QueryParams = Record<string, string | number | boolean | undefined | null>;

export type FetchOptions = Omit<RequestInit, "body" | "method"> & {
  body?: unknown;
  params?: QueryParams;
  token?: string | null;
};

export interface IApiError {
  error: string;
  code: string;
}