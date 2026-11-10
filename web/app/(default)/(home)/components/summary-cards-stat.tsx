import { ReactNode } from "react";

export interface IStatProps {
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
const SummaryCardsStat = ({
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

export default SummaryCardsStat;
