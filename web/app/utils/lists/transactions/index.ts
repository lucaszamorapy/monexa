import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionSituation,
  TransactionType,
} from "@/app/utils/types/transactions";

export interface ITransactionOption<T extends string = string> {
  label: string;
  value: T;
}

export const TRANSACTION_TYPES: ITransactionOption<TransactionType>[] = [
  { label: "Despesa", value: "Despesa" },
  { label: "Entrada", value: "Entrada" },
];

export const TRANSACTION_SITUATIONS: ITransactionOption<TransactionSituation>[] = [
  { label: "Pago", value: "Pago" },
  { label: "Pendente", value: "Pendente" },
];

export const TRANSACTION_CATEGORIES: ITransactionOption<TransactionCategory>[] = [
  { label: "Alimentação", value: "Alimentação" },
  { label: "Aluguel", value: "Aluguel" },
  { label: "Contas", value: "Contas" },
  { label: "Educação", value: "Educação" },
  { label: "Lazer", value: "Lazer" },
  { label: "Moradia", value: "Moradia" },
  { label: "Outros", value: "Outros" },
  { label: "Saúde", value: "Saúde" },
  { label: "Transporte", value: "Transporte" },
  { label: "Salário", value: "Salário" },
  { label: "Investimentos", value: "Investimentos" },
];

export const TRANSACTION_PAYMENT_METHODS: ITransactionOption<TransactionPaymentMethod>[] = [
  { label: "Pix", value: "Pix" },
  { label: "Débito", value: "Débito" },
  { label: "Crédito", value: "Crédito" },
];

