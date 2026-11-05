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
}

interface IStatProps {
  label: string;
  value: string;
  valueClassName?: string;
}

/** Um valor com seu rótulo acima. */
const Stat = ({ label, value, valueClassName = "" }: IStatProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`text-lg font-semibold tabular-nums ${valueClassName}`}>
      {value}
    </span>
  </div>
);

interface ISummaryCardProps {
  title: string;
  description: string;
  main: IStatProps;
  details: IStatProps[];
}

/** Card com um valor principal em destaque e dois detalhes lado a lado. */
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

      <div className="flex items-center gap-4">
        {details.map((detail, index) => (
          <Stat key={index} {...detail} />
        ))}
      </div>
    </CardContent>
  </Card>
);

const HomeCards = ({ transactions }: IHomeCardsProps) => {
  const sumAmount = (items: ITransaction[]) =>
    items.reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions.filter((t) => t.type === "Despesa");

  const totalPixMethod = transactions.filter(
    (t) => t.type === "Entrada" && t.paymentMethod === "Pix",
  );
  const totalDebitMethod = transactions.filter(
    (t) => t.type === "Entrada" && t.paymentMethod === "Débito",
  );

  const totalCreditMethod = transactions.filter(
    (t) => t.type === "Entrada" && t.paymentMethod === "Crédito",
  );

  const totalInput = sumAmount(
    transactions.filter((t) => t.type === "Entrada"),
  );

  const totalExpense = sumAmount(expenses);

  const totalExpensePending = sumAmount(
    expenses.filter((t) => t.situation === "Pendente"),
  );
  const totalExpenseDone = sumAmount(
    expenses.filter((t) => t.situation === "Pago"),
  );

  const balanceWallet = totalInput - totalExpenseDone;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SummaryCard
        title="💰 Carteira"
        description="Controle detalhado da sua carteira"
        main={{
          label: "Saldo atual",
          value: toCurrency(balanceWallet),
          valueClassName:
            balanceWallet >= 0 ? "text-green-600" : "text-red-600",
        }}
        details={[
          {
            label: "Saldo total",
            value: toCurrency(totalInput),
            valueClassName: "text-green-600",
          },
          {
            label: "Total de Métodos de Entrada",
            value: `Pix: ${totalPixMethod.length} | Débito: ${totalDebitMethod.length} | Crédito: ${totalCreditMethod.length}`,
            valueClassName: "text-sm text-muted-foreground",
          },
        ]}
      />

      <SummaryCard
        title="💸 Despesas"
        description="Controle detalhado das despesas"
        main={{
          label: "Despesa atual",
          value: toCurrency(totalExpensePending),
          valueClassName:
            balanceWallet >= 0 ? "text-yellow-600" : "text-green-600",
        }}
        details={[
          {
            label: "Despesa total",
            value: toCurrency(totalExpense),
            valueClassName: "text-red-600",
          },
          {
            label: "Pagas",
            value: toCurrency(totalExpenseDone),
            valueClassName: "text-green-600",
          },
        ]}
      />
    </div>
  );
};

export default HomeCards;
