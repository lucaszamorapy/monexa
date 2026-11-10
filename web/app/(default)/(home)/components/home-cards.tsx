import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { toCurrency } from "@/app/utils/functions/global";
import { ITransaction } from "@/app/utils/types/transactions";
import SummaryCard from "./summary-cards";
import { IStatProps } from "./summary-cards-stat";

interface IHomeCardsProps {
  transactions: ITransaction[];
  previousTransactions: ITransaction[];
}

const HomeCards = ({ transactions, previousTransactions }: IHomeCardsProps) => {
  /** Variação percentual entre o período atual e o anterior. */
  const percentChange = (current: number, previous: number) => {
    if (previous === 0) return null;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  /**
   * Monta as props da porcentagem (texto, cor, ícone e tooltip).
   * @param higherIsGood true = subir é bom (verde); false = subir é ruim (vermelho)
   * @param previousValue total do mês anterior, mostrado no title
   */
  const buildPercent = (
    current: number,
    previousValue: number,
    higherIsGood: boolean,
  ): Pick<
    IStatProps,
    "percentText" | "percentClassName" | "percentIcon" | "percentTitle"
  > => {
    const percentTitle = `Mês anterior: ${toCurrency(previousValue)}`;
    const percent = percentChange(current, previousValue);

    if (percent === null) {
      return {
        percentText: "Sem dados",
        percentClassName: "text-muted-foreground",
        percentIcon: <Minus className="h-3.5 w-3.5" />,
        percentTitle,
      };
    }

    const isUp = percent > 0;
    const isNeutral = percent === 0;
    const isGood = isUp === higherIsGood;

    const percentText = `${isUp ? "+" : isNeutral ? "" : "-"}${Math.abs(percent)
      .toFixed(1)
      .replace(".", ",")}%`;

    if (isNeutral) {
      return {
        percentText,
        percentClassName: "text-muted-foreground",
        percentIcon: <Minus className="h-3.5 w-3.5" />,
        percentTitle,
      };
    }

    return {
      percentText,
      percentClassName: isGood ? "text-green-600" : "text-red-600",
      percentIcon: isUp ? (
        <TrendingUp className="h-3.5 w-3.5" />
      ) : (
        <TrendingDown className="h-3.5 w-3.5" />
      ),
      percentTitle,
    };
  };

  const sumAmount = (items: ITransaction[]) =>
    items.reduce((acc, transaction) => acc + transaction.amount, 0);

  /** Totais de entradas e despesas, despesas pagas e saldo de uma lista. */
  const getSummary = (items: ITransaction[]) => {
    const expenses = items.filter((t) => t.type === "Despesa");

    const input = sumAmount(items.filter((t) => t.type === "Entrada"));
    const expenseTotal = sumAmount(expenses);
    const expensePending = sumAmount(
      expenses.filter((t) => t.situation === "Pendente"),
    );
    const expenseDone = sumAmount(
      expenses.filter((t) => t.situation === "Pago"),
    );

    return {
      input,
      expenseTotal,
      expensePending,
      expenseDone,
      balance: input - expenseDone,
    };
  };

  const current = getSummary(transactions);
  const previous = getSummary(previousTransactions);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SummaryCard
        title="💰 Carteira"
        description="Controle detalhado da sua carteira"
        main={{
          label: "Saldo atual",
          value: toCurrency(current.balance),
          valueClassName:
            current.balance >= 0 ? "text-green-600" : "text-red-600",
        }}
        details={[
          {
            label: "Saldo total",
            value: toCurrency(current.input),
            valueClassName: "text-green-600",
            ...buildPercent(current.input, previous.input, true),
          },
        ]}
      />

      <SummaryCard
        title="💸 Despesas"
        description="Controle detalhado das despesas"
        main={{
          label: "Despesa atual",
          value: toCurrency(current.expensePending),
          valueClassName:
            current.expensePending > 0 ? "text-yellow-600" : "text-green-600",
        }}
        details={[
          {
            label: "Despesa total",
            value: toCurrency(current.expenseTotal),
            valueClassName: "text-red-600",
            ...buildPercent(current.expenseTotal, previous.expenseTotal, false),
          },
          {
            label: "Pagas",
            value: toCurrency(current.expenseDone),
            valueClassName: "text-green-600",
          },
        ]}
      />
    </div>
  );
};

export default HomeCards;
