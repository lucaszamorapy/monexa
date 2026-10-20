import z from "zod"
import { TransactionCategory, TransactionPaymentMethod, TransactionSituation, TransactionType } from "../../generated/prisma/enums.js"

export const TransactionSchemaCreate = z.object({
  type: z.enum(TransactionType),
  category: z.enum(TransactionCategory),
  situation: z.enum(TransactionSituation),
  paymentMethod: z.enum(TransactionPaymentMethod),
  installment: z.number().nullable(),
  installmentNumber: z.number().int().positive().optional(),
  totalAmountIntallment: z.number().optional(),
  amount: z.number(),
  date: z.string(),
  description: z.string().nullable(),
})

export const TransactionSchemaUpdate = z.object({
  transactionId: z.string(),
  userId: z.string(),
  transactionFatherId: z.string().nullable(),
  type: z.enum(TransactionType),
  category: z.enum(TransactionCategory),
  situation: z.enum(TransactionSituation),
  paymentMethod: z.enum(TransactionPaymentMethod),
  installment: z.number().int().positive().nullable(),
  installmentNumber: z.number().int().positive().optional(),
  totalAmountIntallment: z.number().optional(),
  amount: z.number(),
  date: z.string(),
  description: z.string().nullable(),
})

const TransactionSchemaBase = z.object({
  transactionId: z.string(),
  userId: z.string(),
  transactionFatherId: z.string().nullable(),
  type: z.enum(TransactionType),
  situation: z.enum(TransactionSituation),
  paymentMethod: z.enum(TransactionPaymentMethod),
  installment: z.number().int().positive().nullable(),
  installmentNumber: z.number().int().positive().nullable(),
  totalAmountIntallment: z.number().nullable(),
  category: z.enum(TransactionCategory),
  amount: z.number(),
  date: z.date(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TransactionSchemaGetByIdResponse =
  TransactionSchemaBase.extend({
    father: TransactionSchemaBase.nullable(),
    children: z.array(TransactionSchemaBase),
  });

export const TransactionSchemaGetAllQuery = z.object({
  dateInitial: z.string().optional(),
  dateFinal: z.string().optional(),
  type: z.enum(TransactionType).nullable().optional(),
  category: z.enum(TransactionCategory).nullable().optional(),
  paymentMethod: z.enum(TransactionPaymentMethod).nullable().optional(),
  situation: z.enum(TransactionSituation).nullable().optional(),
})

export const TransactionSchemaGetAll = z.array(TransactionSchemaGetByIdResponse)