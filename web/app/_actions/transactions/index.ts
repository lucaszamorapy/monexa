"use server";

import { Request } from "@/app/utils/class/api";
import {
  ICreateTransactionBody,
  ITransaction,
  IUpdateTransactionBody,
} from "@/app/utils/types/transactions";

export const createTransaction = async (
  body: ICreateTransactionBody
): Promise<{ message: string }> => {
  const api = new Request("transactions", { body });
  const res = await api.post<{ message: string }>();
  return res;
};

export const updateTransaction = async (
  id: string,
  body: IUpdateTransactionBody
): Promise<{ message: string }> => {
  const api = new Request(`transactions/${id}`, { body });
  const res = await api.put<{ message: string }>();
  return res;
};

export const getTransactionById = async (
  id: string
): Promise<ITransaction> => {
  const api = new Request(`transactions/${id}`);
  const res = await api.get<ITransaction>();
  return res;
};
