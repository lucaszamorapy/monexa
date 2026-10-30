import { getAllTransactionsByFilter } from "@/app/_actions/transactions";
import { SearchParams } from "../page";
import { ITransaction } from "@/app/utils/types/transactions";
import { DataTable } from "@/components/ui/data-table";
import { transactionColumns } from "./transaction-columns";

const TransactionList = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const filters = await searchParams;
  let transactions: ITransaction[] = [];
  transactions = await getAllTransactionsByFilter(filters);

  return (
    <>
      <div>
        {transactions.length >= 0 && (
          <span className="text-muted-foreground">
            Total de transações: {transactions.length}
          </span>
        )}
      </div>
      <DataTable data={transactions} columns={transactionColumns} />
    </>
  );
};

export default TransactionList;
