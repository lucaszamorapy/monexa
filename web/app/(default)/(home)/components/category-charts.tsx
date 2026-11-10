import { CHART_COLORS } from "@/app/utils/lists/global";
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_CATEGORY_CONFIG,
} from "@/app/utils/lists/transactions";
import {
  ITransaction,
  TransactionCategory,
} from "@/app/utils/types/transactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import ChartPie from "@/components/ui/chart-pie";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ICategoryCharts {
  transactions: ITransaction[];
}

const CategoryCharts = ({ transactions }: ICategoryCharts) => {
  const categories = Object.keys(
    TRANSACTION_CATEGORY_CONFIG,
  ) as TransactionCategory[];

  const chartDataConfig = Object.fromEntries(
    categories.map((c) => {
      const config = TRANSACTION_CATEGORY_CONFIG[c];
      return [
        c,
        {
          label: c,
          color: config.color,
        },
      ];
    }),
  ) satisfies ChartConfig;

  const categoryTotals = TRANSACTION_CATEGORIES.map((category) => ({
    category: category,
    total: transactions.filter((t) => t.category === category).length,
    fill: CHART_COLORS[TRANSACTION_CATEGORY_CONFIG[category].color],
  }));

  return (
    <Card className="flex flex-col w-80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Categorias</CardTitle>
        <CardDescription>
          <span>
            Confira abaixo quais categorias foram mais gastas a partir de{" "}
            {format(new Date(), "MMM. yyyy", { locale: ptBR })}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartPie
          chartData={categoryTotals}
          chartConfig={chartDataConfig}
          dataKey={"total"}
          nameKey="category"
        />
      </CardContent>
    </Card>
  );
};

export default CategoryCharts;
