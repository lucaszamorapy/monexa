import { TransactionCategory, TransactionPaymentMethod, TransactionSituation, TransactionType } from "../../generated/prisma/enums.js";

export interface ICreateTransactionInputDto {
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  situation: TransactionSituation;
  paymentMethod: TransactionPaymentMethod;
  installment: number | null;
  installmentNumber?: number | null;
  amount: number;
  totalAmountIntallment?: number | null;
  date: Date | string;
  description: string;
}

export interface IUpdateTransactionInputDto {
  transactionId?: string;
  userId: string;
  transactionFatherId: string | null;
  type: TransactionType;
  category: TransactionCategory;
  situation: TransactionSituation
  paymentMethod: TransactionPaymentMethod
  installment: number | null;
  installmentNumber?: number | null;
  amount: number;
  totalAmountIntallment?: number | null;
  date: Date | string;
  description: string;
}

export interface ITransaction {
  transactionId: string;
  userId: string;
  transactionFatherId: string | null;
  type: TransactionType;
  category: TransactionCategory;
  situation: TransactionSituation
  paymentMethod: TransactionPaymentMethod
  installment: number | null;
  installmentNumber?: number | null;
  amount: number;
  totalAmountIntallment?: number | null;
  date: Date;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
