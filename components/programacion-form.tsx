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
import { FileUploadDropzone } from "@/components/file-upload-dropzone";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  AlertCircle,
  Sparkles,
  Play,
  Upload,
  Settings2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAgents, useSchedule } from "@/hooks/api";
import { toast } from "sonner";
import type { ScheduleEntry } from "@/lib/types";

interface Agent {
  id: string;
  nombre: string;
  dia: string;
  bloque: string;
}

export function ProgramacionForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [scheduleResults, setScheduleResults] = React.useState<
    ScheduleEntry[] | null
  >(null);
  const [deficitInfo, setDeficitInfo] = React.useState<{
    tiene_deficit: boolean;
    detalles?: string;
  } | null>(null);
  const [csvSectionOpen, setCsvSectionOpen] = React.useState(false);

  const { updateAgentsCsv, loading: uploadLoading } = useAgents();
  const {
    generateSchedule,
    optimizeSchedule,
    loading: scheduleLoading,
  } = useSchedule();

  const parseCSV = React.useCallback(async (file: File) => {
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length > 1) {
      const parsedAgents: Agent[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length >= 4) {
          parsedAgents.push({
            id: values[0],
            nombre: values[1],
            dia: values[2],
            bloque: values[3],
          });
        }
      }

      setAgents(parsedAgents);
    }
  }, []);

  const handleFileSelect = React.useCallback(
    (selectedFile: File | null) => {
      setFile(selectedFile);
      if (selectedFile) {
        parseCSV(selectedFile);
      } else {
        setAgents([]);
      }
    },
    [parseCSV]
  );

  const handleUploadCSV = async () => {
    if (!file) return;

    const csvContent = await file.text();
    const result = await updateAgentsCsv(csvContent);

    if (result.success) {
      toast.success("Archivo CSV cargado exitosamente en el backend");
      setCsvSectionOpen(false);
    } else {
      toast.error(result.error || "No se pudo cargar el archivo");
    }
  };

  const handleGenerateSchedule = async () => {
    const result = await generateSchedule();

    if (result) {
      if (result.success && result.schedules) {
        setScheduleResults(result.schedules);
        setDeficitInfo(result.deficit_info || null);
        toast.success("Horario generado exitosamente con el solver CP-SAT");
      } else {
        toast.error(result.message || "No se pudo generar el horario");
        if (result.deficit_info?.tiene_deficit) {
          setDeficitInfo(result.deficit_info);
        }
      }
    }
  };

  const handleOptimizeSchedule = async () => {
    const result = await optimizeSchedule();

    if (result) {
      if (result.success && result.optimized_schedules) {
        setScheduleResults(result.optimized_schedules);
        toast.success("Horario optimizado exitosamente con LLM");
      } else {
        toast.error(result.message || "No se pudo optimizar el horario");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Programación de Turnos</h1>
        <p className="text-muted-foreground">
          Genera y optimiza horarios con solver CP-SAT e IA
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Generar Horario
            </CardTitle>
            <CardDescription>
              Utiliza el solver CP-SAT para generar el horario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deficitInfo?.tiene_deficit && (
              <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-3 text-amber-600 dark:text-amber-500">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">
                    Advertencia: Déficit Detectado
                  </p>
                  <p>{deficitInfo.detalles}</p>
                </div>
              </div>
            )}
            <Button
              onClick={handleGenerateSchedule}
              disabled={scheduleLoading}
              size="lg"
              className="w-full"
            >
              {scheduleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando horario...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Generar Horario con CP-SAT
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Este proceso utiliza los datos de agentes y demanda almacenados en
              el servidor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Optimizar con LLM
            </CardTitle>
            <CardDescription>
              Mejora el horario generado usando inteligencia artificial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleOptimizeSchedule}
              disabled={scheduleLoading}
              size="lg"
              className="w-full"
              variant="secondary"
            >
              {scheduleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Optimizar con IA
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              El LLM analizará y optimizará el horario actual usando el system
              prompt configurado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Programar manualmente
            </CardTitle>
            <CardDescription>
              Modifica el horario manualmente según consideres
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleOptimizeSchedule}
              disabled={scheduleLoading}
              size="lg"
              className="w-full"
              variant="secondary"
            >
              {scheduleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizando...
                </>
              ) : (
                <>
                  <Settings2 className="mr-2 h-4 w-4" />
                  Modificar manualmente
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              El LLM analizará y optimizará el horario actual usando el system
              prompt configurado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="text-left flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <div>
                <CardTitle>Actualizar CSV de Agentes (Opcional)</CardTitle>
                <CardDescription>
                  Sube un nuevo archivo CSV para actualizar los datos en el
                  servidor
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <FileUploadDropzone
            onFileSelect={handleFileSelect}
            accept=".csv"
            maxSizeMB={5}
          />

          {agents.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Registros Detectados ({agents.length})
                </h3>
                <div className="rounded-md border">
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-muted">
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Nombre</th>
                          <th className="text-left p-3 font-medium">Día</th>
                          <th className="text-left p-3 font-medium">Bloque</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agents.slice(0, 10).map((agent, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="p-3">{agent.id}</td>
                            <td className="p-3">{agent.nombre}</td>
                            <td className="p-3">{agent.dia}</td>
                            <td className="p-3">{agent.bloque}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {agents.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Mostrando 10 de {agents.length} registros
                  </p>
                )}
              </div>
              <Button
                onClick={handleUploadCSV}
                disabled={uploadLoading}
                size="lg"
                className="w-full"
              >
                {uploadLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo al servidor...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Subir CSV al Servidor
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {scheduleResults && scheduleResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados del Horario</CardTitle>
            <CardDescription>
              {scheduleResults.length} entradas de horario generadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Agente</th>
                      <th className="text-left p-3 font-medium">Nombre</th>
                      <th className="text-left p-3 font-medium">Día</th>
                      <th className="text-left p-3 font-medium">Bloque</th>
                      <th className="text-left p-3 font-medium">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleResults.slice(0, 50).map((entry, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-3">{entry.agent_id}</td>
                        <td className="p-3">{entry.nombre}</td>
                        <td className="p-3">{entry.dia}</td>
                        <td className="p-3">
                          {entry.bloque_inicio}-{entry.bloque_fin}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              entry.tipo === "trabajo"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : entry.tipo === "pausa_corta"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                            }`}
                          >
                            {entry.tipo}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {scheduleResults.length > 50 && (
              <p className="text-xs text-muted-foreground mt-2">
                Mostrando 50 de {scheduleResults.length} entradas
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
