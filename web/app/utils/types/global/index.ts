import { TransactionCategory, TransactionPaymentMethod, TransactionSituation, TransactionType } from "../transactions";

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

export type SearchParams = Promise<{
  dateInitial?: string | null;
  dateFinal?: string | null;
  type?: TransactionType | null;
  category?: TransactionCategory | null;
  paymentMethod?: TransactionPaymentMethod | null;
  situation?: TransactionSituation | null;
  description?: string | null;
}>;