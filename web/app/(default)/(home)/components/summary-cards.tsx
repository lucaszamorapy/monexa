import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IStatProps } from "./summary-cards-stat";
import SummaryCardsStat from "./summary-cards-stat";

interface ISummaryCardProps {
  title: string;
  description: string;
  main: IStatProps;
  details: IStatProps[];
}

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
          <SummaryCardsStat key={index} {...detail} />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default SummaryCard;
