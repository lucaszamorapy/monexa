import { getAllTransactionsByFilter } from "@/app/_actions/transactions";
import { SearchParams } from "@/app/utils/types/global";
import { auth } from "@/auth";
import HomeFilter from "./home-filter";
import HomeCards from "./home-cards";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import Link from "next/link";
import { ReactNode } from "react";
import HomeCharts from "./home-charts";

const HomeContent = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const session = await auth();
  const user = session?.user;
  const filters = await searchParams;

  const getPreviousFilters = () => {
    const initial = filters.dateInitial
      ? new Date(`${filters.dateInitial}T00:00:00`)
      : startOfMonth(new Date());

    const previousMonth = subMonths(initial, 1);

    return {
      ...filters,
      dateInitial: format(startOfMonth(previousMonth), "yyyy-MM-dd"),
      dateFinal: format(endOfMonth(previousMonth), "yyyy-MM-dd"),
    };
  };

  const [transactions, previousTransactions] = await Promise.all([
    getAllTransactionsByFilter(filters),
    getAllTransactionsByFilter(getPreviousFilters()),
  ]);

  const getSubtitle = (): ReactNode => {
    if (transactions.length === 0) {
      return "Que tal registrar sua primeira transação deste mês?";
    }

    const now = new Date();
    const startWeek = format(startOfWeek(now), "yyyy-MM-dd");
    const endWeek = format(endOfWeek(now), "yyyy-MM-dd");

    const transactionsThisWeek = transactions.filter((transaction) => {
      const transactionDate = format(new Date(transaction.date), "yyyy-MM-dd");
      return (
        transactionDate >= startWeek &&
        transactionDate <= endWeek &&
        transaction.type === "Despesa" &&
        transaction.situation === "Pendente"
      );
    });

    const count = transactionsThisWeek.length;

    if (count === 0) {
      return "Parabéns! Suas contas estão pagas durante essa semana.";
    }

    return (
      <span>
        Atenção! você tem{" "}
        <Link
          href={`/transactions?dateInitial=${startWeek}&dateFinal=${endWeek}&type=Despesa&situation=Pendente`}
          target="_blank"
          className="font-medium text-red-500 underline underline-offset-4 "
        >
          {count} {count === 1 ? "conta" : "contas"}
        </Link>{" "}
        vencendo nesta semana.
      </span>
    );
  };
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col col-span-1 justify-between">
          <div className="flex flex-col">
            <h2>Olá, {user?.name}!👋</h2>
            <span className="text-muted-foreground">{getSubtitle()}</span>
          </div>
          <HomeFilter />
        </div>
        <div className="lg:col-span-2">
          <HomeCards
            transactions={transactions}
            previousTransactions={previousTransactions}
          />
        </div>
      </div>
      <HomeCharts transactions={transactions} />
    </div>
  );
};

export default HomeContent;
