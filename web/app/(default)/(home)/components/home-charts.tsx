import { ITransaction } from "@/app/utils/types/transactions";
import CategoryChart from "./category-chart";
import PaymentMethodChart from "./payment-method-chart";

interface IHomeChartsProps {
  transactions: ITransaction[];
}

const HomeCharts = ({ transactions }: IHomeChartsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2>Seus gráficos</h2>
        <span className="text-muted-foreground">
          Confira para aonde o seu dinheiro está sendo mais gasto.
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <CategoryChart transactions={transactions} />
        <PaymentMethodChart transactions={transactions} />
      </div>
    </div>
  );
};

export default HomeCharts;
