export type QueryValue = string | number | boolean | undefined | null;

export type QueryParams = Record<string, unknown> | object;

export interface INextFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

export type FetchOptions = Omit<RequestInit, "body" | "method"> & {
  body?: unknown;
  params?: QueryParams;
  query?: QueryParams;
  token?: string | null;
  next?: INextFetchOptions;
};

export interface IApiError {
  error: string;
  code: string;
}