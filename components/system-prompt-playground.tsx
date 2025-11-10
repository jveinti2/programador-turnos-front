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
import { HelpCircle } from "lucide-react";

interface SystemPromptConfig {
  systemPrompt: string;
  model: string;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export function SystemPromptPlayground() {
  const [config, setConfig] = React.useState<SystemPromptConfig>({
    systemPrompt: "",
    model: "gpt-4-turbo",
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Configuración del LLM:", config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Prompt Playground</h1>
          <p className="text-muted-foreground">
            Configura cómo el LLM procesará y ajustará los horarios programados
          </p>
        </div>
        <Button type="submit">Guardar Configuración</Button>
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
            value={config.systemPrompt}
            onChange={(e) =>
              setConfig({ ...config, systemPrompt: e.target.value })
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
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
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
                  value={[config.topP]}
                  onValueChange={(value) =>
                    setConfig({ ...config, topP: value[0] })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={config.topP}
                  onChange={(e) =>
                    setConfig({ ...config, topP: parseFloat(e.target.value) })
                  }
                  className="w-20"
                />
              </div>
            </div>

            {/* Frequency Penalty */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
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
                  id="frequencyPenalty"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[config.frequencyPenalty]}
                  onValueChange={(value) =>
                    setConfig({ ...config, frequencyPenalty: value[0] })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={2}
                  step={0.1}
                  value={config.frequencyPenalty}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      frequencyPenalty: parseFloat(e.target.value),
                    })
                  }
                  className="w-20"
                />
              </div>
            </div>

            {/* Presence Penalty */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="presencePenalty">Presence Penalty</Label>
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
                  id="presencePenalty"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[config.presencePenalty]}
                  onValueChange={(value) =>
                    setConfig({ ...config, presencePenalty: value[0] })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={2}
                  step={0.1}
                  value={config.presencePenalty}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      presencePenalty: parseFloat(e.target.value),
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
