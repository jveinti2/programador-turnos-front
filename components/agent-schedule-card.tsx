"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Search } from "lucide-react";
import { useSchedule } from "@/hooks/api";
import { DAY_LABELS, DayOfWeek, TIME_BLOCKS } from "@/lib/types/enums";
import type { AgentScheduleResponse } from "@/lib/types";

export function AgentScheduleCard() {
  const [agentId, setAgentId] = React.useState("");
  const [scheduleData, setScheduleData] = React.useState<AgentScheduleResponse | null>(null);
  const { getAgentSchedule, loading, error } = useSchedule();

  const handleSearch = async () => {
    if (!agentId.trim()) return;

    const result = await getAgentSchedule(agentId.trim());
    if (result) {
      setScheduleData(result);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const groupByDay = () => {
    if (!scheduleData) return new Map();

    const grouped = new Map<number, typeof scheduleData.schedule>();
    scheduleData.schedule.forEach((entry) => {
      if (!grouped.has(entry.dia)) {
        grouped.set(entry.dia, []);
      }
      grouped.get(entry.dia)!.push(entry);
    });

    return grouped;
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case "trabajo":
        return "bg-blue-500";
      case "pausa_corta":
        return "bg-green-500";
      case "almuerzo":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
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

  const daySchedules = groupByDay();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar Horario de Agente</CardTitle>
        <CardDescription>
          Ingresa el ID del agente para ver su horario completo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="agentId">ID del Agente</Label>
            <Input
              id="agentId"
              placeholder="AG001"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={loading || !agentId.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {error}
          </div>
        )}

        {scheduleData && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-semibold text-lg">{scheduleData.nombre}</h3>
              <p className="text-sm text-muted-foreground">
                ID: {scheduleData.agent_id} • {scheduleData.schedule.length} entradas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {[0, 1, 2, 3, 4, 5, 6].map((dia) => {
                const dayEntries = daySchedules.get(dia) || [];
                const hasEntries = dayEntries.length > 0;

                return (
                  <div
                    key={dia}
                    className={`border rounded-lg p-3 ${
                      hasEntries ? "bg-muted/30" : "bg-muted/10"
                    }`}
                  >
                    <div className="font-semibold text-sm mb-3 text-center border-b pb-2">
                      {DAY_LABELS[dia as DayOfWeek]}
                    </div>

                    {hasEntries ? (
                      <div className="space-y-2">
                        {dayEntries
                          .sort((a, b) => a.bloque_inicio - b.bloque_inicio)
                          .map((entry, idx) => (
                            <div
                              key={idx}
                              className={`rounded p-2 text-white text-xs ${getTypeColor(entry.tipo)}`}
                            >
                              <div className="font-semibold">{getTypeLabel(entry.tipo)}</div>
                              <div className="text-[10px] opacity-90 mt-1">
                                {TIME_BLOCKS.getTimeFromBlock(entry.bloque_inicio)} -{" "}
                                {TIME_BLOCKS.getTimeFromBlock(entry.bloque_fin)}
                              </div>
                              {entry.duracion_horas && (
                                <div className="text-[10px] opacity-90">
                                  {entry.duracion_horas}h
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center text-xs text-muted-foreground py-2">
                        Día libre
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 text-xs pt-2 border-t">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span>Trabajo</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span>Pausa</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span>Almuerzo</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
