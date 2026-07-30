import z from "zod"
import { TransactionCategory, TransactionType } from "../../generated/prisma/enums.js"

export const TransactionSchemaCreate = z.object({
  type: z.enum(TransactionType),
  category: z.enum(TransactionCategory),
  amount: z.number(),
  date: z.string(),
  description: z.string().nullable(),
})

export const TransactionSchemaUpdate = z.object({
  type: z.enum(TransactionType),
  category: z.enum(TransactionCategory),
  amount: z.number(),
  date: z.string(),
  description: z.string().nullable(),
})