export type TransactionType = "Despesa" | "Entrada";

export type TransactionCategory =
  | "Alimentação"
  | "Aluguel"
  | "Contas"
  | "Educação"
  | "Lazer"
  | "Moradia"
  | "Outros"
  | "Saúde"
  | "Transporte"
  | "Salário"
  | "Investimentos";

export type TransactionSituation = "Pago" | "Pendente";

export type TransactionPaymentMethod = "Pix" | "Débito" | "Crédito";

export interface ICreateTransactionBody {
  type: TransactionType;
  category: TransactionCategory;
  situation: TransactionSituation;
  paymentMethod: TransactionPaymentMethod;
  installment: number | null;
  amount: number;
  date: string;
  description: string | null;
}

export interface IUpdateTransactionBody {
  transactionId: string;
  userId: string;
  transactionFatherId: string | null;
  type: TransactionType;
  category: TransactionCategory;
  situation: TransactionSituation;
  paymentMethod: TransactionPaymentMethod;
  installment: number | null;
  installmentNumber?: number;
  totalAmountIntallment?: number;
  amount: number;
  date: string;
  description: string | null;
}

export interface ITransaction {
  transactionId: string;
  userId: string;
  transactionFatherId: string | null;
  type: TransactionType;
  category: TransactionCategory;
  situation: TransactionSituation;
  paymentMethod: TransactionPaymentMethod;
  installment: number | null;
  installmentNumber?: number | null;
  amount: number;
  totalAmountIntallment?: number | null;
  date: string | Date;
  description: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  father?: ITransaction | null;
  children?: ITransaction[];
}

export interface IGetAllTransactionsByFilterBody {
  dateInitial?: string | null;
  dateFinal?: string | null;
  type?: TransactionType | null;
  category?: TransactionCategory | null;
  paymentMethod?: TransactionPaymentMethod | null;
  situation?: TransactionSituation | null;
  description?: string | null;
}



