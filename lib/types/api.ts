export interface TurnosConfig {
  duracion_min_horas: number;
  duracion_max_horas: number;
  duracion_total_max_horas: number;
  descanso_entre_turnos_horas: number;
  dias_libres_min_por_semana: number;
}

export interface PausasCortasConfig {
  duracion_minutos: number;
  frecuencia_cada_horas: number;
  obligatorias: boolean;
  separacion_minima_horas: number;
  prohibir_primera_hora: boolean;
  prohibir_ultima_hora: boolean;
  maximo_por_turno: number;
}

export interface AlmuerzoConfig {
  duracion_min_minutos: number;
  duracion_max_minutos: number;
  obligatorio_si_turno_mayor_a_horas: number;
  maximo_por_turno: number;
  prohibir_primera_hora: boolean;
  prohibir_ultima_hora: boolean;
}

export interface SolverConfig {
  timeout_segundos: number;
  num_workers: number;
}

export interface CoberturaConfig {
  margen_seguridad: number;
  bloquear_si_deficit: boolean;
}

export interface ReglasYAML {
  turnos: TurnosConfig;
  pausas_cortas: PausasCortasConfig;
  almuerzo: AlmuerzoConfig;
  solver: SolverConfig;
  cobertura: CoberturaConfig;
}

export interface SystemPromptConfig {
  system_prompt: string;
  model: string;
  temperature: number;
  top_p: number;
  frecuency_penalty: number;
  presence_penalty: number;
}

export interface ScheduleEntry {
  agent_id: string;
  nombre: string;
  dia: number;
  bloque_inicio: number;
  bloque_fin: number;
  tipo: "trabajo" | "pausa_corta" | "almuerzo";
  duracion_horas?: number;
}

export interface AgentScheduleResponse {
  agent_id: string;
  nombre: string;
  schedule: ScheduleEntry[];
}

export interface CoverageByDay {
  dia: number;
  demanda: number;
  cobertura: number;
}

export interface DeficitGap {
  day: number;
  day_name: string;
  start_time: string;
  end_time: string;
  required_agents: number;
  available_agents: number;
  deficit: number;
}

export interface DeficitAnalysis {
  has_deficit: boolean;
  has_critical_gaps: boolean;
  total_deficit_hours: number;
  gaps: DeficitGap[];
}

export interface DeficitRecommendation {
  message: string;
  additional_agents_needed: number;
  problematic_days: string[];
  severity: "critical" | "warning" | "info";
}

export interface GenerateScheduleResponse {
  status: "OPTIMAL" | "FEASIBLE" | "INFEASIBLE" | "insufficient_coverage";
  message?: string;
  agentes_disponibles?: number;
  agentes_faltantes?: number;
  cobertura_por_dia?: CoverageByDay[];
  deficit_analysis?: DeficitAnalysis;
  recommendation?: DeficitRecommendation;
}

export interface OptimizeScheduleRequest {
  temperature_override?: number;
  custom_instructions?: string;
}

export interface OptimizeScheduleResponse {
  success: boolean;
  message: string;
  optimized_schedules?: ScheduleEntry[];
}

export interface UpdateScheduleRequest {
  schedules: ScheduleEntry[];
}

export interface UpdateScheduleResponse {
  success: boolean;
  message: string;
}

export interface HealthResponse {
  status: string;
  timestamp?: string;
}

export interface DashboardMetric {
  title: string;
  value: string;
  description: string;
}

export interface DemandCoveragePoint {
  time: string;
  block: number;
  demanda: number;
  disponibilidad: number;
}

export interface ApiError {
  detail?: string;
  message?: string;
  error?: string;
}
