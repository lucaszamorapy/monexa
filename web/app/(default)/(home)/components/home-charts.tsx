import { ITransaction } from "@/app/utils/types/transactions";
import CategoryCharts from "./category-charts";

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
      <div className="flex items-center justify-between">
        <CategoryCharts transactions={transactions} />
      </div>
    </div>
  );
};

export default HomeCharts;
