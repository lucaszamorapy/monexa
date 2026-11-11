import { CHART_COLORS } from "@/app/utils/lists/global";
import {
  TRANSACTION_PAYMENT_METHOD_CONFIG,
  TRANSACTION_PAYMENT_METHODS,
} from "@/app/utils/lists/transactions";
import {
  ITransaction,
  TransactionPaymentMethod,
} from "@/app/utils/types/transactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import ChartBarHorizontal from "@/components/ui/chart-bar-horizontal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface IPaymentMethodCharts {
  transactions: ITransaction[];
}

const PaymentMethodChart = ({ transactions }: IPaymentMethodCharts) => {
  const paymentMethods = Object.keys(
    TRANSACTION_PAYMENT_METHOD_CONFIG,
  ) as TransactionPaymentMethod[];

  const chartDataConfig = Object.fromEntries(
    paymentMethods.map((c) => {
      const config = TRANSACTION_PAYMENT_METHOD_CONFIG[c];
      return [
        c,
        {
          label: c,
          color: config.color,
        },
      ];
    }),
  ) satisfies ChartConfig;

  const paymentMethodsTotals = TRANSACTION_PAYMENT_METHODS.map((p) => ({
    paymentMethod: p,
    total: transactions.filter((t) => t.paymentMethod === p).length,
    fill: CHART_COLORS[TRANSACTION_PAYMENT_METHOD_CONFIG[p].color],
  }));

  return (
    <Card className="flex flex-col ">
      <CardHeader className="items-center pb-0">
        <CardTitle>📊 Métodos de Pagamento</CardTitle>
        <CardDescription>
          <span>
            Confira abaixo quais métodos de pagamentos foram mais utilizados a
            partir de {format(new Date(), "MMM. yyyy", { locale: ptBR })}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartBarHorizontal
          chartData={paymentMethodsTotals}
          chartConfig={chartDataConfig}
          dataKeyBar={"total"}
          dataKeyXAxis={"total"}
          dataKeyYAxis={"paymentMethod"}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentMethodChart;
