import { useState, useCallback } from "react";
import { agentsService } from "@/lib/api";

export function useAgents() {
  const [agentsCsv, setAgentsCsv] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgentsCsv = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agentsService.getAgentsCsv();
      setAgentsCsv(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el CSV de agentes");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAgentsCsv = useCallback(async (csvContent: string) => {
    setLoading(true);
    setError(null);
    try {
      await agentsService.updateAgentsCsv(csvContent);
      setAgentsCsv(csvContent);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar el CSV de agentes";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    agentsCsv,
    loading,
    error,
    fetchAgentsCsv,
    updateAgentsCsv,
  };
}
