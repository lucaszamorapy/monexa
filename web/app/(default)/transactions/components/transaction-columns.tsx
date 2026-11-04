"use client";

import { toCurrency } from "@/app/utils/functions/global";
import {
  TRANSACTION_CATEGORY_CONFIG,
  TRANSACTION_COLOR_CLASSES,
  TRANSACTION_PAYMENT_METHOD_CONFIG,
  TRANSACTION_SITUATION_CONFIG,
  TRANSACTION_TYPE_CONFIG,
  TransactionBadgeConfig,
} from "@/app/utils/lists/transactions";
import { ITransaction } from "@/app/utils/types/transactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "@/components/ui/data-table-features";
import { createColumnHelper } from "@tanstack/react-table";
import { cn } from "cn";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import TransactionDelete from "./transaction-delete";
import TransactionForm from "./transaction-form";
import TransactionUpdateSituation from "./transaction-update-situation";

const renderBadge = (label: string, config?: TransactionBadgeConfig) => {
  if (!config) {
    return <Badge variant="outline">{label}</Badge>;
  }

  const resolvedClass =
    config.className ??
    (config.color ? TRANSACTION_COLOR_CLASSES[config.color] : "");

  return (
    <Badge
      variant="outline"
      className={cn(
        "border px-2 py-0.5 text-xs font-medium normal-case tracking-normal gap-1.5",
        resolvedClass,
      )}
      style={
        config.color && !resolvedClass
          ? { color: config.color, borderColor: config.color }
          : undefined
      }
    >
      {config.emoji && <span className="text-xs">{config.emoji}</span>}
      <span>{label}</span>
    </Badge>
  );
};

const columnHelper = createColumnHelper<DataTableFeatures, ITransaction>();

export const transactionColumns = columnHelper.columns([
  columnHelper.accessor("type", {
    header: "Tipo",
    size: 110,
    cell: ({ row }) => {
      const type = row.original.type;
      return renderBadge(type, TRANSACTION_TYPE_CONFIG[type]);
    },
  }),
  columnHelper.accessor("category", {
    header: "Categoria",
    size: 140,
    cell: ({ row }) => {
      const category = row.original.category;
      return renderBadge(category, TRANSACTION_CATEGORY_CONFIG[category]);
    },
  }),
  columnHelper.accessor("paymentMethod", {
    header: "Método de Pag.",
    size: 130,
    cell: ({ row }) => {
      const { paymentMethod } = row.original;
      return renderBadge(
        paymentMethod,
        TRANSACTION_PAYMENT_METHOD_CONFIG[paymentMethod],
      );
    },
  }),
  columnHelper.accessor("situation", {
    header: "Situação",
    size: 110,
    cell: ({ row }) => {
      const situation = row.original.situation;
      return renderBadge(situation, TRANSACTION_SITUATION_CONFIG[situation]);
    },
  }),
  columnHelper.accessor("amount", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { installment, totalAmountIntallment, installmentNumber, amount } =
        row.original;
      const amountCurrency = toCurrency(amount);
      return (
        <div className="flex flex-col">
          <span>{amountCurrency}</span>
          {installment && (
            <span className="text-muted-foreground text-sm">
              {installmentNumber}ª de {toCurrency(totalAmountIntallment || 0)}
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor("date", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ArrowUpDown />
        </Button>
      );
    },
    size: 100,
    cell: ({ row }) => {
      const { date } = row.original;
      return <span>{format(date, "dd/MM/yyyy")}</span>;
    },
  }),
  columnHelper.accessor("description", {
    header: "Descrição",
    size: 300,
  }),
  columnHelper.display({
    id: "actions",
    header: "Ações",
    size: 85,
    cell: ({ row }) => {
      const { transactionId, situation } = row.original;
      return (
        <div className="flex items-center justify-center">
          <TransactionForm transactionId={transactionId} />
          <TransactionDelete transactionId={transactionId} />
          <TransactionUpdateSituation
            transactionId={transactionId}
            situation={situation}
          />
        </div>
      );
    },
  }),
]);
