"use server";

import { Request } from "@/app/utils/class/api";
import {
  ICreateTransactionBody,
  IGetAllTransactionsByFilterBody,
  ITransaction,
  IUpdateTransactionBody,
} from "@/app/utils/types/transactions";
import { revalidateTag } from "next/cache";

export const getAllTransactionsByFilter = async (filter: IGetAllTransactionsByFilterBody): Promise<ITransaction[]> => {
  const api = new Request("transactions", {
    query: filter,
    next: { tags: ["transactions"] },
  });
  const res = await api.get<ITransaction[]>();
  return res;
};

export const createTransaction = async (
  body: ICreateTransactionBody
): Promise<{ message: string }> => {
  const api = new Request("transactions", { body });
  const res = await api.post<{ message: string }>();
  revalidateTag("transactions", { expire: 0 });
  return res;
};

export const updateTransaction = async (
  id: string,
  body: IUpdateTransactionBody
): Promise<{ message: string }> => {
  const api = new Request(`transactions/${id}`, { body });
  const res = await api.put<{ message: string }>();
  revalidateTag("transactions", { expire: 0 });
  return res;
};

export const getTransactionById = async (
  id: string
): Promise<ITransaction> => {
  const api = new Request(`transactions/${id}`);
  const res = await api.get<ITransaction>();
  return res;
};
