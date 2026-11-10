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
}
const ChartPie = ({
  className,
  chartData,
  chartConfig,
  dataKey,
  nameKey,
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
        />
        <Pie data={chartData} dataKey={dataKey} nameKey={nameKey} />
      </PieChart>
    </ChartContainer>
  );
};

export default ChartPie;
