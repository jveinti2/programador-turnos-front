"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePrompt } from "@/hooks/api";
import type { SystemPromptConfig } from "@/lib/types";
import { LLM_MODEL_LABELS, LLMModel } from "@/lib/types/enums";
import { toast } from "sonner";

export function SystemPromptPlayground() {
  const { prompt, loading, error, updatePrompt } = usePrompt();
  const [config, setConfig] = React.useState<SystemPromptConfig | null>(null);

  React.useEffect(() => {
    if (prompt) {
      setConfig(prompt);
    }
  }, [prompt]);

  const isDirty = React.useMemo(() => {
    if (!prompt || !config) return false;
    return JSON.stringify(prompt) !== JSON.stringify(config);
  }, [prompt, config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    const result = await updatePrompt(config);
    if (result.success) {
      toast.success("Configuración del prompt actualizada exitosamente");
    } else {
      toast.error(result.error || "No se pudo guardar la configuración");
    }
  };

  if (loading && !config) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        <p className="font-semibold">Error al cargar la configuración</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!config) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">System Prompt Playground</h1>
            <p className="text-muted-foreground">
              Configura cómo el LLM procesará y ajustará los horarios programados
            </p>
          </div>
          {isDirty && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Cambios sin guardar
            </Badge>
          )}
        </div>
        <Button type="submit" disabled={loading || !isDirty}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : !isDirty ? (
            "Sin cambios"
          ) : (
            "Guardar Configuración"
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Prompt</CardTitle>
          <CardDescription>
            Instrucciones que guiarán al LLM en el post-procesamiento de horarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Eres un asistente experto en optimización de horarios laborales. Tu tarea es revisar y ajustar los horarios generados..."
            value={config.system_prompt}
            onChange={(e) =>
              setConfig({ ...config, system_prompt: e.target.value })
            }
            rows={8}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modelo</CardTitle>
          <CardDescription>Selecciona el modelo de OpenAI a utilizar</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={config.model}
            onValueChange={(value) => setConfig({ ...config, model: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LLM_MODEL_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parámetros del Modelo</CardTitle>
          <CardDescription>
            Ajusta el comportamiento del LLM para el post-procesamiento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TooltipProvider>
            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Controla la creatividad del modelo. Valores bajos (0-0.3) son más
                      deterministas y consistentes. Valores altos (0.7-2) son más creativos
                      y variados.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[config.temperature]}
                  onValueChange={(value) =>
                    setConfig({ ...config, temperature: value[0] })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={2}
                  step={0.1}
                  value={config.temperature}
                  onChange={(e) =>
                    setConfig({ ...config, temperature: parseFloat(e.target.value) })
                  }
                  className="w-20"
                />
              </div>
            </div>

            {/* Top P */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="topP">Top P</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Controla la diversidad de respuestas mediante nucleus sampling.
                      Valores cercanos a 1 consideran más opciones, valores bajos son más
                      enfocados.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="topP"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[config.top_p]}
                  onValueChange={(value) =>
                    setConfig({ ...config, top_p: value[0] })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={config.top_p}
                  onChange={(e) =>
                    setConfig({ ...config, top_p: parseFloat(e.target.value) })
                  }
                  className="w-20"
                />
              </div>
            </div>

            {/* Frequency Penalty */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="frecuency_penalty">Frequency Penalty</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Penaliza tokens repetidos según su frecuencia. Valores positivos
                      reducen la repetición de palabras ya usadas.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="frecuency_penalty"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={[config.frecuency_penalty]}
                  onValueChange={(value) =>
                    setConfig({ ...config, frecuency_penalty: value[0] })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={config.frecuency_penalty}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      frecuency_penalty: parseFloat(e.target.value),
                    })
                  }
                  className="w-20"
                />
              </div>
            </div>

            {/* Presence Penalty */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="presence_penalty">Presence Penalty</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Penaliza tokens repetidos sin importar su frecuencia. Fomenta hablar
                      de nuevos temas en lugar de repetir los existentes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="presence_penalty"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={[config.presence_penalty]}
                  onValueChange={(value) =>
                    setConfig({ ...config, presence_penalty: value[0] })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={config.presence_penalty}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      presence_penalty: parseFloat(e.target.value),
                    })
                  }
                  className="w-20"
                />
              </div>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </form>
  );
}
