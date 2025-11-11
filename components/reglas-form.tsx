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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { useRules } from "@/hooks/api";
import type { ReglasYAML } from "@/lib/types";
import { toast } from "sonner";

export function ReglasForm() {
  const { rules, loading, error, updateRules } = useRules();
  const [formData, setFormData] = React.useState<ReglasYAML | null>(null);

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    turnos: true,
    pausas: false,
    almuerzo: false,
    solver: false,
    cobertura: false,
  });

  React.useEffect(() => {
    if (rules) {
      setFormData(rules);
    }
  }, [rules]);

  const isDirty = React.useMemo(() => {
    if (!rules || !formData) return false;
    return JSON.stringify(rules) !== JSON.stringify(formData);
  }, [rules, formData]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const result = await updateRules(formData);
    if (result.success) {
      toast.success("Reglas actualizadas exitosamente");
    } else {
      toast.error(result.error || "No se pudieron guardar las reglas");
    }
  };

  if (loading && !formData) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        <p className="font-semibold">Error al cargar las reglas</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Configuración de Reglas</h1>
            <p className="text-muted-foreground">
              Define las restricciones para la programación de turnos
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
            "Guardar Reglas"
          )}
        </Button>
      </div>

      {/* Sección Turnos */}
      <Collapsible
        open={openSections.turnos}
        onOpenChange={() => toggleSection("turnos")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle>Turnos</CardTitle>
                  <CardDescription>
                    Duración y tipo de restricción de turnos
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSections.turnos ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracion_min_horas">Duración Mínima (horas)</Label>
                  <Input
                    id="duracion_min_horas"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.turnos.duracion_min_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        turnos: {
                          ...formData.turnos,
                          duracion_min_horas: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duracion_max_horas">Duración Máxima (horas)</Label>
                  <Input
                    id="duracion_max_horas"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.turnos.duracion_max_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        turnos: {
                          ...formData.turnos,
                          duracion_max_horas: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracion_total_max_horas">Duración Total Máxima (horas)</Label>
                  <Input
                    id="duracion_total_max_horas"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.turnos.duracion_total_max_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        turnos: {
                          ...formData.turnos,
                          duracion_total_max_horas: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descanso_entre_turnos_horas">Descanso entre Turnos (horas)</Label>
                  <Input
                    id="descanso_entre_turnos_horas"
                    type="number"
                    min="0"
                    max="24"
                    value={formData.turnos.descanso_entre_turnos_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        turnos: {
                          ...formData.turnos,
                          descanso_entre_turnos_horas: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dias_libres_min_por_semana">Días Libres Mínimos por Semana</Label>
                <Input
                  id="dias_libres_min_por_semana"
                  type="number"
                  min="0"
                  max="7"
                  value={formData.turnos.dias_libres_min_por_semana}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      turnos: {
                        ...formData.turnos,
                        dias_libres_min_por_semana: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Sección Pausas */}
      <Collapsible
        open={openSections.pausas}
        onOpenChange={() => toggleSection("pausas")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle>Pausas</CardTitle>
                  <CardDescription>
                    Configuración de pausas durante el turno
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSections.pausas ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracion_pausas_minutos">Duración (minutos)</Label>
                  <Input
                    id="duracion_pausas_minutos"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.pausas_cortas.duracion_minutos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pausas_cortas: {
                          ...formData.pausas_cortas,
                          duracion_minutos: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frecuencia_cada_horas">Frecuencia (cada N horas)</Label>
                  <Input
                    id="frecuencia_cada_horas"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    value={formData.pausas_cortas.frecuencia_cada_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pausas_cortas: {
                          ...formData.pausas_cortas,
                          frecuencia_cada_horas: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="separacion_minima_horas">
                    Separación Mínima (horas)
                  </Label>
                  <Input
                    id="separacion_minima_horas"
                    type="number"
                    step="0.5"
                    min="0"
                    max="12"
                    value={formData.pausas_cortas.separacion_minima_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pausas_cortas: {
                          ...formData.pausas_cortas,
                          separacion_minima_horas: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximo_por_turno">Máximo por Turno</Label>
                  <Input
                    id="maximo_por_turno"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.pausas_cortas.maximo_por_turno}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pausas_cortas: {
                          ...formData.pausas_cortas,
                          maximo_por_turno: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pausas_obligatorias">Pausas Obligatorias</Label>
                  <Switch
                    id="pausas_obligatorias"
                    checked={formData.pausas_cortas.obligatorias}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        pausas_cortas: { ...formData.pausas_cortas, obligatorias: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="prohibir_primera_hora">
                    Prohibir Primera Hora
                  </Label>
                  <Switch
                    id="prohibir_primera_hora"
                    checked={formData.pausas_cortas.prohibir_primera_hora}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        pausas_cortas: { ...formData.pausas_cortas, prohibir_primera_hora: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="prohibir_ultima_hora">Prohibir Última Hora</Label>
                  <Switch
                    id="prohibir_ultima_hora"
                    checked={formData.pausas_cortas.prohibir_ultima_hora}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        pausas_cortas: { ...formData.pausas_cortas, prohibir_ultima_hora: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Sección Almuerzo */}
      <Collapsible
        open={openSections.almuerzo}
        onOpenChange={() => toggleSection("almuerzo")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle>Almuerzo</CardTitle>
                  <CardDescription>
                    Configuración del periodo de almuerzo
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSections.almuerzo ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="almuerzo_duracion_min">
                    Duración Mínima (minutos)
                  </Label>
                  <Input
                    id="almuerzo_duracion_min"
                    type="number"
                    value={formData.almuerzo.duracion_min_minutos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        almuerzo: {
                          ...formData.almuerzo,
                          duracion_min_minutos: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="almuerzo_duracion_max">
                    Duración Máxima (minutos)
                  </Label>
                  <Input
                    id="almuerzo_duracion_max"
                    type="number"
                    value={formData.almuerzo.duracion_max_minutos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        almuerzo: {
                          ...formData.almuerzo,
                          duracion_max_minutos: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="obligatorio_si_turno_mayor_a_horas">
                    Obligatorio si Turno Mayor a (horas)
                  </Label>
                  <Input
                    id="obligatorio_si_turno_mayor_a_horas"
                    type="number"
                    step="0.5"
                    min="0"
                    max="12"
                    value={formData.almuerzo.obligatorio_si_turno_mayor_a_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        almuerzo: {
                          ...formData.almuerzo,
                          obligatorio_si_turno_mayor_a_horas: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    0 = nunca obligatorio
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximo_por_turno_almuerzo">Máximo por Turno</Label>
                  <Input
                    id="maximo_por_turno_almuerzo"
                    type="number"
                    min="0"
                    max="5"
                    value={formData.almuerzo.maximo_por_turno}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        almuerzo: {
                          ...formData.almuerzo,
                          maximo_por_turno: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prohibir_primera_hora_almuerzo">
                    Prohibir Primera Hora
                  </Label>
                  <Switch
                    id="prohibir_primera_hora_almuerzo"
                    checked={formData.almuerzo.prohibir_primera_hora}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        almuerzo: { ...formData.almuerzo, prohibir_primera_hora: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="prohibir_ultima_hora_almuerzo">Prohibir Última Hora</Label>
                  <Switch
                    id="prohibir_ultima_hora_almuerzo"
                    checked={formData.almuerzo.prohibir_ultima_hora}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        almuerzo: { ...formData.almuerzo, prohibir_ultima_hora: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Sección Solver */}
      <Collapsible
        open={openSections.solver}
        onOpenChange={() => toggleSection("solver")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle>Solver</CardTitle>
                  <CardDescription>
                    Configuración del solver CP-SAT
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSections.solver ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeout_segundos">Timeout (segundos)</Label>
                  <Input
                    id="timeout_segundos"
                    type="number"
                    min="1"
                    max="3600"
                    value={formData.solver.timeout_segundos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        solver: {
                          ...formData.solver,
                          timeout_segundos: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num_workers">Número de Workers</Label>
                  <Input
                    id="num_workers"
                    type="number"
                    min="1"
                    max="128"
                    value={formData.solver.num_workers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        solver: {
                          ...formData.solver,
                          num_workers: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Sección Cobertura */}
      <Collapsible
        open={openSections.cobertura}
        onOpenChange={() => toggleSection("cobertura")}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle>Cobertura</CardTitle>
                  <CardDescription>
                    Configuración de cobertura y déficit
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSections.cobertura ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="margen_seguridad">Margen de Seguridad</Label>
                <Input
                  id="margen_seguridad"
                  type="number"
                  step="0.1"
                  min="1"
                  max="3"
                  value={formData.cobertura.margen_seguridad}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cobertura: {
                        ...formData.cobertura,
                        margen_seguridad: parseFloat(e.target.value),
                      },
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Factor multiplicador para la demanda (ej. 1.2 = 20% más cobertura)
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="bloquear_si_deficit">
                    Bloquear si Hay Déficit
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    No generar horario si hay déficit de agentes
                  </p>
                </div>
                <Switch
                  id="bloquear_si_deficit"
                  checked={formData.cobertura.bloquear_si_deficit}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      cobertura: {
                        ...formData.cobertura,
                        bloquear_si_deficit: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </form>
  );
}
