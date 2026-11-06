import { ReactNode } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { toCurrency } from "@/app/utils/functions/global";
import { ITransaction } from "@/app/utils/types/transactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface IHomeCardsProps {
  transactions: ITransaction[];
  previousTransactions: ITransaction[];
}

interface IStatProps {
  label: string;
  value: string;
  valueClassName?: string;
  /** Texto da porcentagem (ex: "+12,5%"). */
  percentText?: string;
  percentClassName?: string;
  percentIcon?: ReactNode;
  /** Tooltip da porcentagem (ex: "Mês anterior: R$ 3.500,00"). */
  percentTitle?: string;
}

/** Um valor com seu rótulo acima e, opcionalmente, a porcentagem ao lado. */
const Stat = ({
  label,
  value,
  valueClassName = "",
  percentText,
  percentClassName = "",
  percentIcon,
  percentTitle,
}: IStatProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`text-lg font-semibold tabular-nums ${valueClassName}`}>
        {value}
      </span>
      {percentText && (
        <span
          className={`flex items-center gap-1 text-xs font-medium tabular-nums ${percentClassName}`}
          title={percentTitle}
        >
          {percentIcon}
          {percentText}
        </span>
      )}
    </div>
  </div>
);

interface ISummaryCardProps {
  title: string;
  description: string;
  main: IStatProps;
  details: IStatProps[];
}

/** Card com um valor principal em destaque e detalhes lado a lado. */
const SummaryCard = ({
  title,
  description,
  main,
  details,
}: ISummaryCardProps) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>

    <CardContent className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{main.label}</span>
        <span
          className={`text-3xl font-bold tabular-nums ${main.valueClassName ?? ""}`}
        >
          {main.value}
        </span>
      </div>

      <Separator />

      <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
        {details.map((detail, index) => (
          <Stat key={index} {...detail} />
        ))}
      </div>
    </CardContent>
  </Card>
);

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
  const expenseDone = sumAmount(expenses.filter((t) => t.situation === "Pago"));

  return {
    input,
    expenseTotal,
    expensePending,
    expenseDone,
    balance: input - expenseDone,
  };
};

const HomeCards = ({ transactions, previousTransactions }: IHomeCardsProps) => {
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
