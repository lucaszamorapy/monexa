"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A simple pie chart";

interface IChartPieProps {
  className?: string;
  chartData: unknown[];
  chartConfig: ChartConfig;
  dataKey: string;
  nameKey: string;
  valueFormatter?: (value: number) => string;
}

const ChartPie = ({
  className,
  chartData,
  chartConfig,
  dataKey,
  nameKey,
  valueFormatter,
}: IChartPieProps) => {
  return (
    <ChartContainer
      config={chartConfig}
      className={className || "mx-auto aspect-square max-h-62.5"}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
          formatter={(value, name) => (
            <div className="flex w-full items-center justify-between gap-2">
              <span>{name}</span>
              <span>
                {valueFormatter ? valueFormatter(Number(value)) : String(value)}
              </span>
            </div>
          )}
        />
        <Pie data={chartData} dataKey={dataKey} nameKey={nameKey} />
      </PieChart>
    </ChartContainer>
  );
};

export default ChartPie;
