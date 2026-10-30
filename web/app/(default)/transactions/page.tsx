import TransactionForm from "./components/transaction-form";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionSituation,
  TransactionType,
} from "@/app/utils/types/transactions";
import TransactionFilter from "./components/transaction-filter";
import TransactionList from "./components/transaction-list";

export type SearchParams = Promise<{
  dateInitial?: string | null;
  dateFinal?: string | null;
  type?: TransactionType | null;
  category?: TransactionCategory | null;
  paymentMethod?: TransactionPaymentMethod | null;
  situation?: TransactionSituation | null;
  description?: string | null;
}>;

const TransactionsPage = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2>Transações</h2>
          <span className="text-muted-foreground">
            Crie, edite e filtre suas transações financeiras de forma prática e
            eficiente.
          </span>
        </div>
        <TransactionForm />
      </div>

      <Suspense fallback={<Loader />}>
        <TransactionFilter />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <TransactionList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default TransactionsPage;
