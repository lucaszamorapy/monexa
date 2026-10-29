import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionSituation,
  TransactionType,
} from "@/app/utils/types/transactions";

export const TRANSACTION_TYPES: TransactionType[] = ["Despesa", "Entrada"];

export const TRANSACTION_SITUATIONS: TransactionSituation[] = ["Pago", "Pendente"];

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  "Alimentação",
  "Aluguel",
  "Contas",
  "Educação",
  "Lazer",
  "Moradia",
  "Outros",
  "Saúde",
  "Transporte",
  "Salário",
  "Investimentos",
];

export const TRANSACTION_PAYMENT_METHODS: TransactionPaymentMethod[] = [
  "Pix",
  "Débito",
  "Crédito",
];