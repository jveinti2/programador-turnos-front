import { useState, useEffect, useCallback } from "react";
import { demandCoverageService } from "@/lib/api/services/demandCoverage.service";
import type { DemandCoveragePoint } from "@/lib/types/api";

export function useDemandCoverage(day: number) {
  const [data, setData] = useState<DemandCoveragePoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDemandCoverage = useCallback(async () => {
    if (day < 0 || day > 6) {
      setError("Día inválido");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const coverage = await demandCoverageService.getDemandCoverage(day);
      setData(coverage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos de cobertura");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [day]);

  useEffect(() => {
    fetchDemandCoverage();
  }, [fetchDemandCoverage]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDemandCoverage,
  };
}
