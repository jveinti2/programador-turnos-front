import { useState, useEffect, useCallback } from "react";
import { promptService } from "@/lib/api";
import type { SystemPromptConfig } from "@/lib/types";

export function usePrompt() {
  const [prompt, setPrompt] = useState<SystemPromptConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompt = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promptService.getPrompt();
      setPrompt(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la configuración del prompt");
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePrompt = useCallback(async (newPrompt: SystemPromptConfig) => {
    setLoading(true);
    setError(null);
    try {
      await promptService.updatePrompt(newPrompt);
      setPrompt(newPrompt);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar el prompt";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompt();
  }, [fetchPrompt]);

  return {
    prompt,
    loading,
    error,
    refetch: fetchPrompt,
    updatePrompt,
  };
}
