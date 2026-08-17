import { TransactionCategory, TransactionSituation, TransactionType } from "../../generated/prisma/enums.js";

export interface ICreateTransactionInputDto {
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  situation: TransactionSituation
  amount: number;
  date: Date | string;
  description: string;
}

export interface IUpdateTransactionInputDto {
  transactionId?: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: Date | string;
  description: string;
}

export interface ITransaction {
  transactionId: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: Date;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
