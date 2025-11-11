export enum DayOfWeek {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}

export const DAY_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: "Lunes",
  [DayOfWeek.TUESDAY]: "Martes",
  [DayOfWeek.WEDNESDAY]: "Miércoles",
  [DayOfWeek.THURSDAY]: "Jueves",
  [DayOfWeek.FRIDAY]: "Viernes",
  [DayOfWeek.SATURDAY]: "Sábado",
  [DayOfWeek.SUNDAY]: "Domingo",
};

export enum LLMModel {
  GPT_4 = "gpt-4",
  GPT_4_TURBO = "gpt-4-turbo-preview",
  GPT_4O = "gpt-4o",
  GPT_4O_MINI = "gpt-4o-mini",
  GPT_3_5_TURBO = "gpt-3.5-turbo",
}

export const LLM_MODEL_LABELS: Record<LLMModel, string> = {
  [LLMModel.GPT_4]: "GPT-4",
  [LLMModel.GPT_4_TURBO]: "GPT-4 Turbo",
  [LLMModel.GPT_4O]: "GPT-4o",
  [LLMModel.GPT_4O_MINI]: "GPT-4o Mini",
  [LLMModel.GPT_3_5_TURBO]: "GPT-3.5 Turbo",
};

export enum ProcessStep {
  UPLOAD = 1,
  GENERATE = 2,
  OPTIMIZE = 3,
  MANUAL = 4,
}

export const PROCESS_STEP_LABELS: Record<ProcessStep, string> = {
  [ProcessStep.UPLOAD]: "Subir Datos",
  [ProcessStep.GENERATE]: "Generar Horario",
  [ProcessStep.OPTIMIZE]: "Optimizar con IA",
  [ProcessStep.MANUAL]: "Ajustes Manuales",
};

export const TIME_BLOCKS = {
  TOTAL: 48,
  MINUTES_PER_BLOCK: 30,

  getTimeFromBlock: (block: number): string => {
    const hours = Math.floor(block / 2);
    const minutes = (block % 2) * 30;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  },

  getBlockFromTime: (hours: number, minutes: number): number => {
    return hours * 2 + (minutes >= 30 ? 1 : 0);
  },

  getHoursFromBlocks: (startBlock: number, endBlock: number): number => {
    const totalBlocks = endBlock - startBlock;
    return (totalBlocks * TIME_BLOCKS.MINUTES_PER_BLOCK) / 60;
  },

  getBlockRange: (startBlock: number, endBlock: number): string => {
    return `${TIME_BLOCKS.getTimeFromBlock(startBlock)} - ${TIME_BLOCKS.getTimeFromBlock(endBlock)}`;
  },
};
