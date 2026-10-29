import TransactionForm from "./components/transaction-form";

const TransactionsPage = () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h2>Transações</h2>
        <TransactionForm />
      </div>
    </div>
  );
};

export default TransactionsPage;
