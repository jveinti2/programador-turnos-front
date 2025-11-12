export function generateExampleScheduleCSV(): string {
  const headers = [
    "agent_id",
    "agent_name",
    "day",
    "shift_start",
    "shift_end",
    "break_start",
    "break_end",
    "disconnected_start",
    "disconnected_end",
  ];

  const exampleRows = [
    ["A001", "Juan Pérez", "lunes", "08:00", "17:30", "09:30", "09:45", "", ""],
    ["A001", "Juan Pérez", "lunes", "08:00", "17:30", "13:00", "13:15", "", ""],
    ["A001", "Juan Pérez", "martes", "09:00", "18:30", "09:00", "09:15", "", ""],
    ["A001", "Juan Pérez", "martes", "09:00", "18:30", "", "", "13:30", "14:00"],
    ["A002", "María García", "lunes", "10:00", "17:00", "10:00", "10:15", "", ""],
    ["A002", "María García", "miercoles", "08:00", "16:00", "11:30", "11:45", "", ""],
    ["A003", "Carlos Rodríguez", "lunes", "07:30", "16:00", "08:30", "08:45", "", ""],
    ["A003", "Carlos Rodríguez", "jueves", "10:00", "18:00", "", "", "13:00", "14:00"],
  ];

  const csvContent = [headers.join(","), ...exampleRows.map((row) => row.join(","))].join("\n");

  return csvContent;
}

export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function validateScheduleCSV(content: string): {
  valid: boolean;
  errors: string[];
  rowCount: number;
} {
  const errors: string[] = [];
  const lines = content.split("\n").filter((line) => line.trim());

  if (lines.length < 2) {
    errors.push("El archivo CSV debe contener al menos una fila de encabezado y una fila de datos");
    return { valid: false, errors, rowCount: 0 };
  }

  const requiredHeaders = ["agent_id", "agent_name", "day", "shift_start", "shift_end"];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const missingHeaders = requiredHeaders.filter((rh) => !headers.includes(rh));
  if (missingHeaders.length > 0) {
    errors.push(`Faltan columnas requeridas: ${missingHeaders.join(", ")}`);
  }

  const validDays = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  const dayIndex = headers.indexOf("day");
  const shiftStartIndex = headers.indexOf("shift_start");
  const shiftEndIndex = headers.indexOf("shift_end");

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());

    if (dayIndex >= 0 && values[dayIndex]) {
      const day = values[dayIndex].toLowerCase();
      if (!validDays.includes(day)) {
        errors.push(`Fila ${i + 1}: día inválido "${values[dayIndex]}"`);
      }
    }

    if (shiftStartIndex >= 0 && values[shiftStartIndex]) {
      if (!timeRegex.test(values[shiftStartIndex])) {
        errors.push(`Fila ${i + 1}: hora de inicio inválida "${values[shiftStartIndex]}"`);
      }
    }

    if (shiftEndIndex >= 0 && values[shiftEndIndex]) {
      if (!timeRegex.test(values[shiftEndIndex])) {
        errors.push(`Fila ${i + 1}: hora de fin inválida "${values[shiftEndIndex]}"`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    rowCount: lines.length - 1,
  };
}
