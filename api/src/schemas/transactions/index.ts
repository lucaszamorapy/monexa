import z from "zod"
import { TransactionCategory, TransactionSituation, TransactionType } from "../../generated/prisma/enums.js"

export const TransactionSchemaCreate = z.object({
  type: z.enum(TransactionType),
  category: z.enum(TransactionCategory),
  situation: z.enum(TransactionSituation),
  amount: z.number(),
  date: z.string(),
  description: z.string().nullable(),
})

export const TransactionSchemaUpdate = z.object({
  type: z.enum(TransactionType),
  category: z.enum(TransactionCategory),
  situation: z.enum(TransactionSituation),
  amount: z.number(),
  date: z.string(),
  description: z.string().nullable(),
})

export const TransactionSchemaGetByIdResponse = z.object({
  transactionId: z.string(),
  userId: z.string(),
  type: z.enum(TransactionType),
  situation: z.enum(TransactionSituation),
  category: z.enum(TransactionCategory),
  amount: z.number(),
  date: z.date(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const TransactionSchemaGetAllQuery = z.object({
  dateInitial: z.string().optional(),
  dateFinal: z.string().optional(),
})

export const TransactionSchemaGetAll = z.array(TransactionSchemaGetByIdResponse)