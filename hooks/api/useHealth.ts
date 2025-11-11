import { useState, useCallback } from "react";
import { healthService } from "@/lib/api";
import type { HealthResponse } from "@/lib/types";

export function useHealth() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await healthService.checkHealth();
      setHealth(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al verificar el estado de la API");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    health,
    loading,
    error,
    checkHealth,
  };
}
