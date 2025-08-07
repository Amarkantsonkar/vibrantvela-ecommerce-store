"use client";
import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Colors } from "@/constants/Colors";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TrendingUp } from "lucide-react";

// Bar colors config
const chartConfig = {
  keyboard: { label: "keyboard", color: Colors.customGray },
  mouse: { label: "mouse", color: Colors.customYellow },
  headset: { label: "headset", color: Colors.customIsabelline },
};

// Full list of months in correct order
const monthOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Component
const Chart1 = ({ chartData }) => {
  // Transform backend format into Recharts format
  const transformedData = useMemo(() => {
    if (!chartData) return [];

    return monthOrder.map((month) => {
      const monthData = chartData[month] || {};
      return {
        month,
        keyboard: monthData.Keyboard || 0,
        mouse: monthData.Mouse || 0,
        headset: monthData.Headset || 0,
      };
    });
  }, [chartData]);

  return (
    <Card className="flex-1 rounded-xl bg-muted/50 md:min-h-min">
      <CardHeader>
        <CardTitle>Bar chart - Multiple</CardTitle>
        <CardDescription>January - December 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={transformedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              interval={0} // Show all months
              tick={{
                fontSize: 10,
                angle: -45,
                textAnchor: "end",
              }}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="keyboard" fill="var(--color-keyboard)" radius={4} />
            <Bar dataKey="mouse" fill="var(--color-mouse)" radius={4} />
            <Bar dataKey="headset" fill="var(--color-headset)" radius={4} />
          </BarChart>
        </ChartContainer>
        <CardFooter className="flex-col items-start gap-2 text-sm mt-4">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 12 months
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default Chart1;
