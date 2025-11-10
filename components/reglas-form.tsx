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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";

interface ReglasFormData {
  turnos: {
    duracion_min_horas: number;
    duracion_max_horas: number;
    tipo_restriccion: "exacta" | "flexible" | "rango";
  };
  pausas: {
    duracion_minutos: number;
    frecuencia_cada_horas: number;
    obligatorias: boolean;
    separacion_minima_horas: number;
    prohibir_primera_hora: boolean;
    prohibir_ultima_hora: boolean;
    maximo_por_turno: number;
  };
  almuerzo: {
    duracion_min_minutos: number;
    duracion_max_minutos: number;
    obligatorio_si_turno_supera_horas: number;
    ventana_inicio_hora: number;
    ventana_fin_hora: number;
  };
  cobertura: {
    requisitos: Record<string, number>;
    permitir_deficit: boolean;
    bloquear_si_deficit: boolean;
  };
}

export function ReglasForm() {
  const [formData, setFormData] = React.useState<ReglasFormData>({
    turnos: {
      duracion_min_horas: 8,
      duracion_max_horas: 9,
      tipo_restriccion: "rango",
    },
    pausas: {
      duracion_minutos: 15,
      frecuencia_cada_horas: 3,
      obligatorias: true,
      separacion_minima_horas: 2.5,
      prohibir_primera_hora: true,
      prohibir_ultima_hora: true,
      maximo_por_turno: 4,
    },
    almuerzo: {
      duracion_min_minutos: 30,
      duracion_max_minutos: 60,
      obligatorio_si_turno_supera_horas: 6,
      ventana_inicio_hora: 12,
      ventana_fin_hora: 14,
    },
    cobertura: {
      requisitos: {},
      permitir_deficit: false,
      bloquear_si_deficit: true,
    },
  });

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    turnos: true,
    pausas: false,
    almuerzo: false,
    cobertura: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reglas a enviar al backend:", formData);
    // Aquí se enviará al backend
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configuración de Reglas</h1>
          <p className="text-muted-foreground">
            Define las restricciones para la programación de turnos
          </p>
        </div>
        <Button type="submit">Guardar Reglas</Button>
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
                    step="0.5"
                    value={formData.turnos.duracion_min_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        turnos: {
                          ...formData.turnos,
                          duracion_min_horas: parseFloat(e.target.value),
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
                    step="0.5"
                    value={formData.turnos.duracion_max_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        turnos: {
                          ...formData.turnos,
                          duracion_max_horas: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_restriccion">Tipo de Restricción</Label>
                <Select
                  value={formData.turnos.tipo_restriccion}
                  onValueChange={(value: "exacta" | "flexible" | "rango") =>
                    setFormData({
                      ...formData,
                      turnos: { ...formData.turnos, tipo_restriccion: value },
                    })
                  }
                >
                  <SelectTrigger id="tipo_restriccion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exacta">Exacta</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="rango">Rango</SelectItem>
                  </SelectContent>
                </Select>
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
                    value={formData.pausas.duracion_minutos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pausas: {
                          ...formData.pausas,
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
                    value={formData.pausas.frecuencia_cada_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pausas: {
                          ...formData.pausas,
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
                    value={formData.pausas.separacion_minima_horas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pausas: {
                          ...formData.pausas,
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
                    value={formData.pausas.maximo_por_turno}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pausas: {
                          ...formData.pausas,
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
                    checked={formData.pausas.obligatorias}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        pausas: { ...formData.pausas, obligatorias: checked },
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
                    checked={formData.pausas.prohibir_primera_hora}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        pausas: { ...formData.pausas, prohibir_primera_hora: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="prohibir_ultima_hora">Prohibir Última Hora</Label>
                  <Switch
                    id="prohibir_ultima_hora"
                    checked={formData.pausas.prohibir_ultima_hora}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        pausas: { ...formData.pausas, prohibir_ultima_hora: checked },
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
              <div className="space-y-2">
                <Label htmlFor="obligatorio_si_turno_supera">
                  Obligatorio si Turno Supera (horas)
                </Label>
                <Input
                  id="obligatorio_si_turno_supera"
                  type="number"
                  step="0.5"
                  value={formData.almuerzo.obligatorio_si_turno_supera_horas}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      almuerzo: {
                        ...formData.almuerzo,
                        obligatorio_si_turno_supera_horas: parseFloat(e.target.value),
                      },
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  0 = nunca obligatorio
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ventana_inicio_hora">
                    Ventana Inicio (hora del día)
                  </Label>
                  <Input
                    id="ventana_inicio_hora"
                    type="number"
                    min="0"
                    max="23"
                    value={formData.almuerzo.ventana_inicio_hora}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        almuerzo: {
                          ...formData.almuerzo,
                          ventana_inicio_hora: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ventana_fin_hora">Ventana Fin (hora del día)</Label>
                  <Input
                    id="ventana_fin_hora"
                    type="number"
                    min="0"
                    max="23"
                    value={formData.almuerzo.ventana_fin_hora}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        almuerzo: {
                          ...formData.almuerzo,
                          ventana_fin_hora: parseInt(e.target.value),
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
                    Requisitos de cobertura por bloque horario
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="permitir_deficit">Permitir Déficit</Label>
                  <Switch
                    id="permitir_deficit"
                    checked={formData.cobertura.permitir_deficit}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        cobertura: { ...formData.cobertura, permitir_deficit: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bloquear_si_deficit">
                    Bloquear si Hay Déficit
                  </Label>
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
              </div>
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Los requisitos de cobertura por bloque horario se configurarán en
                  una sección específica próximamente.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </form>
  );
}
