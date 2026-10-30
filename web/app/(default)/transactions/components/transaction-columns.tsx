"use client";

import { toCurrency } from "@/app/utils/functions/global";
import { ITransaction } from "@/app/utils/types/transactions";
import { DataTableFeatures } from "@/components/ui/data-table-features";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import TransactionForm from "./transaction-form";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, ITransaction>();

export const transactionColumns = columnHelper.columns([
  columnHelper.accessor("type", {
    header: "Tipo",
    size: 100,
  }),
  columnHelper.accessor("category", {
    header: "Categoria",
    size: 100,
  }),
  columnHelper.accessor("paymentMethod", {
    header: "Método de Pag.",
    size: 100,
    cell: ({ row }) => {
      const { paymentMethod } = row.original;
      return <span>{paymentMethod}</span>;
    },
  }),
  columnHelper.accessor("situation", {
    header: "Situação",
    size: 100,
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
    size: 50,
    cell: ({ row }) => {
      const { transactionId } = row.original;
      return <TransactionForm transactionId={transactionId} />;
    },
  }),
]);
