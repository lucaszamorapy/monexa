"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

interface IChartHorizontalProps {
  className?: string;
  chartData: unknown[];
  chartConfig: ChartConfig;
  dataKeyBar: string;
  dataKeyXAxis: string;
  dataKeyYAxis: string;
}

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const ChartBarHorizontal = ({
  className,
  chartData,
  chartConfig,
  dataKeyBar,
  dataKeyXAxis,
  dataKeyYAxis,
}: IChartHorizontalProps) => {
  return (
    <ChartContainer className={className} config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: -20,
        }}
      >
        <XAxis type="number" dataKey={dataKeyXAxis} hide />
        <YAxis
          dataKey={dataKeyYAxis}
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey={dataKeyBar} fill="var(--color-desktop)" radius={5} />
      </BarChart>
    </ChartContainer>
  );
};

export default ChartBarHorizontal;
