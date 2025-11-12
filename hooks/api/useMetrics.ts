import { useState, useEffect, useCallback } from "react";
import { metricsService } from "@/lib/api/services/metrics.service";
import type { DashboardMetric } from "@/lib/types/api";

export function useMetrics() {
  const [data, setData] = useState<DashboardMetric[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const metrics = await metricsService.getDashboardMetrics();
      setData(metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar métricas");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
}
