import { TransactionCategory, TransactionPaymentMethod, TransactionSituation, TransactionType } from "../../generated/prisma/enums.js";

export interface IGetAllTransactionsInputDto {
  dateInitial?: string | null;
  dateFinal?: string | null;
  type?: TransactionType | null;
  category?: TransactionCategory | null;
  paymentMethod?: TransactionPaymentMethod | null;
  situation?: TransactionSituation | null;
}

export interface ICreateTransactionInputDto {
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  situation: TransactionSituation;
  paymentMethod: TransactionPaymentMethod;
  installment: number | null; //quantidade de parcelas
  amount: number;
  date: Date | string;
  description: string;
}

export interface IUpdateTransactionInputDto {
  transactionId?: string;
  userId: string;
  transactionFatherId: string | null;
  type: TransactionType;
  category: TransactionCategory;
  situation: TransactionSituation;
  paymentMethod: TransactionPaymentMethod;
  installment: number | null;
  amount: number;
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
