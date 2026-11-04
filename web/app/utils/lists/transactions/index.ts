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

export interface TransactionBadgeConfig {
  emoji: string;
  color: string;
  className?: string;
}

export const TRANSACTION_COLOR_CLASSES: Record<string, string> = {
  red: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  blue: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  sky: "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  indigo: "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  purple: "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  pink: "border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-400",
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  orange: "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  teal: "border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400",
  cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  slate: "border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  zinc: "border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

export const TRANSACTION_TYPE_CONFIG: Record<
  TransactionType,
  TransactionBadgeConfig
> = {
  Despesa: {
    emoji: "💸",
    color: "red",
    className: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
  Entrada: {
    emoji: "💰",
    color: "green",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
};

export const TRANSACTION_SITUATION_CONFIG: Record<
  TransactionSituation,
  TransactionBadgeConfig
> = {
  Pago: {
    emoji: "✅",
    color: "green",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  Pendente: {
    emoji: "⏳",
    color: "amber",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};

export const TRANSACTION_CATEGORY_CONFIG: Record<
  TransactionCategory,
  TransactionBadgeConfig
> = {
  Alimentação: {
    emoji: "🍽️",
    color: "orange",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  Aluguel: {
    emoji: "🏠",
    color: "blue",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  Contas: {
    emoji: "🧾",
    color: "yellow",
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  Educação: {
    emoji: "📚",
    color: "indigo",
    className: "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  Lazer: {
    emoji: "🎉",
    color: "pink",
    className: "border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  Moradia: {
    emoji: "🏡",
    color: "cyan",
    className: "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  Outros: {
    emoji: "📦",
    color: "slate",
    className: "border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  },
  Saúde: {
    emoji: "💊",
    color: "rose",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  Transporte: {
    emoji: "🚗",
    color: "sky",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  Salário: {
    emoji: "💼",
    color: "emerald",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  Investimentos: {
    emoji: "📈",
    color: "purple",
    className: "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
};

export const TRANSACTION_PAYMENT_METHOD_CONFIG: Record<
  TransactionPaymentMethod,
  TransactionBadgeConfig
> = {
  Pix: {
    emoji: "⚡",
    color: "teal",
    className: "border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  Débito: {
    emoji: "💳",
    color: "blue",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  Crédito: {
    emoji: "💳",
    color: "purple",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
};
