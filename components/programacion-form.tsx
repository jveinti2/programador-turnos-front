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
import { StepsIndicator } from "@/components/steps-indicator";
import { Separator } from "@/components/ui/separator";

const STEPS = [
  {
    label: "Programación",
    description: "Solver optimiza turnos",
  },
  {
    label: "Post-procesamiento",
    description: "LLM ajusta horarios",
  },
  {
    label: "Ajustes Manuales",
    description: "Revisión final",
  },
];

interface Agent {
  id: string;
  nombre: string;
  disponibilidad?: string;
}

export function ProgramacionForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleFileSelect = React.useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      parseCSV(selectedFile);
    } else {
      setAgents([]);
    }
  }, []);

  const parseCSV = async (file: File) => {
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length > 0) {
      const headers = lines[0].split(",").map((h) => h.trim());
      const parsedAgents: Agent[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length >= 1 && values[0]) {
          parsedAgents.push({
            id: `agent-${i}`,
            nombre: values[0],
            disponibilidad: values[1] || "No especificada",
          });
        }
      }

      setAgents(parsedAgents);
    }
  };

  const handleStartProgramacion = () => {
    if (!file) return;

    setIsProcessing(true);
    console.log("Iniciando programación con archivo:", file.name);
    console.log("Agentes detectados:", agents);

    setTimeout(() => {
      setCurrentStep(2);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Programación de Turnos</h1>
          <p className="text-muted-foreground">
            Carga el archivo de agentes e inicia el proceso de programación
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progreso</CardTitle>
          <CardDescription>
            Sigue el proceso de programación en tres etapas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepsIndicator steps={STEPS} currentStep={currentStep} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cargar Archivo de Agentes</CardTitle>
          <CardDescription>
            Sube un archivo CSV con la información de los agentes disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  Agentes Detectados ({agents.length})
                </h3>
                <div className="rounded-md border">
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-muted">
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Nombre</th>
                          <th className="text-left p-3 font-medium">
                            Disponibilidad
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {agents.map((agent) => (
                          <tr key={agent.id} className="border-b last:border-0">
                            <td className="p-3">{agent.nombre}</td>
                            <td className="p-3 text-muted-foreground">
                              {agent.disponibilidad}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Iniciar Proceso</CardTitle>
          <CardDescription>
            Comienza la programación automática de turnos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleStartProgramacion}
            disabled={!file || isProcessing}
            size="lg"
            className="w-full"
          >
            {isProcessing ? "Procesando..." : "Iniciar Programación"}
          </Button>
        </CardContent>
      </Card>

      {currentStep > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Visualiza y gestiona los turnos generados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-8 text-center">
              <p className="text-sm text-muted-foreground">
                La visualización de resultados y ajustes manuales se implementará
                próximamente.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
