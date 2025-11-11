"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ScheduleEntry } from "@/lib/types";
import { DAY_LABELS, DayOfWeek, TIME_BLOCKS } from "@/lib/types/enums";

interface ScheduleViewerProps {
  schedules: ScheduleEntry[];
}

export function ScheduleViewer({ schedules }: ScheduleViewerProps) {
  const [selectedAgent, setSelectedAgent] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"week" | "day">("week");

  const uniqueAgents = React.useMemo(() => {
    const agentsMap = new Map<string, string>();
    schedules.forEach((entry) => {
      agentsMap.set(entry.agent_id, entry.nombre);
    });
    return Array.from(agentsMap.entries());
  }, [schedules]);

  const filteredSchedules = React.useMemo(() => {
    if (selectedAgent === "all") return schedules;
    return schedules.filter((entry) => entry.agent_id === selectedAgent);
  }, [schedules, selectedAgent]);

  const groupByAgentAndDay = (entries: ScheduleEntry[]) => {
    const grouped = new Map<string, Map<number, ScheduleEntry[]>>();

    entries.forEach((entry) => {
      if (!grouped.has(entry.agent_id)) {
        grouped.set(entry.agent_id, new Map());
      }
      const agentMap = grouped.get(entry.agent_id)!;
      if (!agentMap.has(entry.dia)) {
        agentMap.set(entry.dia, []);
      }
      agentMap.get(entry.dia)!.push(entry);
    });

    return grouped;
  };

  const groupedSchedules = groupByAgentAndDay(filteredSchedules);

  const getTimeSlot = (bloqueInicio: number, bloqueFin: number) => {
    return `${TIME_BLOCKS.getTimeFromBlock(bloqueInicio)} - ${TIME_BLOCKS.getTimeFromBlock(bloqueFin)}`;
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case "trabajo":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "pausa_corta":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "almuerzo":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeLabel = (tipo: string) => {
    switch (tipo) {
      case "trabajo":
        return "Trabajo";
      case "pausa_corta":
        return "Pausa";
      case "almuerzo":
        return "Almuerzo";
      default:
        return tipo;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Visualización de Horarios</CardTitle>
            <CardDescription>
              {selectedAgent === "all"
                ? `${uniqueAgents.length} agentes, ${schedules.length} entradas`
                : `${filteredSchedules.length} entradas para ${uniqueAgents.find(([id]) => id === selectedAgent)?.[1]}`}
            </CardDescription>
          </div>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Seleccionar agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los agentes</SelectItem>
              {uniqueAgents.map(([id, nombre]) => (
                <SelectItem key={id} value={id}>
                  {nombre} ({id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from(groupedSchedules.entries()).map(([agentId, dayMap]) => {
            const agentName = uniqueAgents.find(([id]) => id === agentId)?.[1] || agentId;

            return (
              <div key={agentId} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">
                  {agentName} <span className="text-muted-foreground text-sm">({agentId})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {[0, 1, 2, 3, 4, 5, 6].map((dia) => {
                    const dayEntries = dayMap.get(dia) || [];
                    const hasEntries = dayEntries.length > 0;

                    return (
                      <div
                        key={dia}
                        className={`border rounded-md p-3 ${
                          hasEntries ? "bg-muted/30" : "bg-muted/10"
                        }`}
                      >
                        <div className="font-medium text-sm mb-2 text-center">
                          {DAY_LABELS[dia as DayOfWeek]}
                        </div>

                        {hasEntries ? (
                          <div className="space-y-2">
                            {dayEntries
                              .sort((a, b) => a.bloque_inicio - b.bloque_inicio)
                              .map((entry, idx) => (
                                <div
                                  key={idx}
                                  className={`rounded-md p-2 text-xs ${getTypeColor(entry.tipo)}`}
                                >
                                  <div className="font-medium">{getTypeLabel(entry.tipo)}</div>
                                  <div className="text-[10px] mt-1">
                                    {getTimeSlot(entry.bloque_inicio, entry.bloque_fin)}
                                  </div>
                                  {entry.duracion_horas && (
                                    <div className="text-[10px]">
                                      {entry.duracion_horas}h
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center text-xs text-muted-foreground">
                            Libre
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {groupedSchedules.size === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay horarios para mostrar
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
