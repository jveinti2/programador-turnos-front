import { useState, useCallback } from "react";
import { scheduleService } from "@/lib/api";
import type {
  GenerateScheduleResponse,
  OptimizeScheduleRequest,
  OptimizeScheduleResponse,
  UpdateScheduleRequest,
  UpdateScheduleResponse,
  AgentScheduleResponse,
} from "@/lib/types";

export function useSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSchedule = useCallback(async (): Promise<GenerateScheduleResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await scheduleService.generateSchedule();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar el horario");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeSchedule = useCallback(
    async (params?: OptimizeScheduleRequest): Promise<OptimizeScheduleResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await scheduleService.optimizeSchedule(params);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al optimizar el horario");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateSchedule = useCallback(
    async (request: UpdateScheduleRequest): Promise<UpdateScheduleResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await scheduleService.updateSchedule(request);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al actualizar el horario");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAgentSchedule = useCallback(
    async (agentId: string): Promise<AgentScheduleResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await scheduleService.getAgentSchedule(agentId);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al obtener el horario del agente");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    generateSchedule,
    optimizeSchedule,
    updateSchedule,
    getAgentSchedule,
  };
}
