import { useState, useEffect, useCallback } from "react";
import { rulesService } from "@/lib/api";
import type { ReglasYAML } from "@/lib/types";

export function useRules() {
  const [rules, setRules] = useState<ReglasYAML | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rulesService.getRules();
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las reglas");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRules = useCallback(async (newRules: ReglasYAML) => {
    setLoading(true);
    setError(null);
    try {
      await rulesService.updateRules(newRules);
      setRules(newRules);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar las reglas";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,
    loading,
    error,
    refetch: fetchRules,
    updateRules,
  };
}
