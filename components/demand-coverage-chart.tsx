"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemandCoverage } from "@/hooks/api/useDemandCoverage";
import { Skeleton } from "@/components/ui/skeleton";

const daysOfWeek = [
  { label: "Lunes", value: "0" },
  { label: "Martes", value: "1" },
  { label: "Miércoles", value: "2" },
  { label: "Jueves", value: "3" },
  { label: "Viernes", value: "4" },
  { label: "Sábado", value: "5" },
  { label: "Domingo", value: "6" },
];

const chartConfig = {
  agentes: {
    label: "Agentes",
  },
  demanda: {
    label: "Demanda",
    color: "var(--chart-6)",
  },
  disponibilidad: {
    label: "Disponibilidad",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DemandCoverageChart() {
  const [selectedDay, setSelectedDay] = React.useState("0");
  const { data: chartData, isLoading, error } = useDemandCoverage(parseInt(selectedDay));

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Demanda vs Disponibilidad</CardTitle>
          <CardDescription>
            Comparación de agentes requeridos y disponibles por bloque de 30
            minutos
          </CardDescription>
        </div>
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Seleccionar día"
          >
            <SelectValue placeholder="Seleccionar día" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {daysOfWeek.map((day) => (
              <SelectItem
                key={day.value}
                value={day.value}
                className="rounded-lg"
              >
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-[350px] w-full" />
          </div>
        ) : error || !chartData ? (
          <div className="flex h-[350px] items-center justify-center">
            <p className="text-sm text-destructive">Error cargando datos del gráfico</p>
          </div>
        ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDemanda" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-demanda)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-demanda)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillDisponibilidad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-disponibilidad)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-disponibilidad)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const [hour] = value.split(":");
                return `${hour}:00`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Hora: ${value}`}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="demanda"
              type="monotone"
              fill="url(#fillDemanda)"
              stroke="var(--color-demanda)"
              stackId="a"
            />
            <Area
              dataKey="disponibilidad"
              type="monotone"
              fill="url(#fillDisponibilidad)"
              stroke="var(--color-disponibilidad)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
