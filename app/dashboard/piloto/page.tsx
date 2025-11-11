"use client"

import { useState, useEffect } from "react"
import { Gantt, Task, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AgentScheduleData {
  id: string
  name: string
  schedule: {
    [day: string]: {
      start: string
      end: string
      break: Array<{ start: string; end: string }>
      disconnected: Array<{ start: string; end: string }>
    }
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

const dayNames = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function transformAllAgentsToGantt(agents: AgentScheduleData[]): Task[] {
  const tasks: Task[] = []
  const baseDate = new Date(2025, 0, 6)

  agents.forEach((agent, agentIndex) => {
    Object.entries(agent.schedule).forEach(([day, daySchedule]) => {
      const dayDate = new Date(baseDate)
      const normalizedDay = day.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const mappedDayIndex = dayNames.findIndex(d =>
        d.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedDay
      )

      if (mappedDayIndex === -1) return

      dayDate.setDate(baseDate.getDate() + mappedDayIndex)

      const workStart = timeToMinutes(daySchedule.start)
      const workEnd = timeToMinutes(daySchedule.end)

      const startDate = new Date(dayDate)
      startDate.setHours(Math.floor(workStart / 60), workStart % 60, 0)

      const endDate = new Date(dayDate)
      endDate.setHours(Math.floor(workEnd / 60), workEnd % 60, 0)

      const colors = [
        { bg: "#3b82f6", selected: "#2563eb", progress: "#1e40af", progressSelected: "#1e3a8a" },
        { bg: "#10b981", selected: "#059669", progress: "#047857", progressSelected: "#065f46" },
        { bg: "#8b5cf6", selected: "#7c3aed", progress: "#6d28d9", progressSelected: "#5b21b6" },
        { bg: "#f59e0b", selected: "#d97706", progress: "#b45309", progressSelected: "#92400e" },
        { bg: "#ec4899", selected: "#db2777", progress: "#be185d", progressSelected: "#9f1239" },
      ]
      const color = colors[agentIndex % colors.length]

      tasks.push({
        id: `${agent.id}-${day}-work`,
        name: `${agent.name} - ${day}`,
        start: startDate,
        end: endDate,
        type: "task",
        progress: 100,
        styles: {
          backgroundColor: color.bg,
          backgroundSelectedColor: color.selected,
          progressColor: color.progress,
          progressSelectedColor: color.progressSelected
        }
      })

      daySchedule.break?.forEach((breakPeriod, idx) => {
        const breakStart = timeToMinutes(breakPeriod.start)
        const breakEnd = timeToMinutes(breakPeriod.end)

        const breakStartDate = new Date(dayDate)
        breakStartDate.setHours(Math.floor(breakStart / 60), breakStart % 60, 0)

        const breakEndDate = new Date(dayDate)
        breakEndDate.setHours(Math.floor(breakEnd / 60), breakEnd % 60, 0)

        tasks.push({
          id: `${agent.id}-${day}-break-${idx}`,
          name: `${agent.name} - Pausa`,
          start: breakStartDate,
          end: breakEndDate,
          type: "task",
          progress: 100,
          styles: {
            backgroundColor: "#fbbf24",
            backgroundSelectedColor: "#f59e0b",
            progressColor: "#d97706",
            progressSelectedColor: "#b45309"
          }
        })
      })

      daySchedule.disconnected?.forEach((discPeriod, idx) => {
        const discStart = timeToMinutes(discPeriod.start)
        const discEnd = timeToMinutes(discPeriod.end)

        const discStartDate = new Date(dayDate)
        discStartDate.setHours(Math.floor(discStart / 60), discStart % 60, 0)

        const discEndDate = new Date(dayDate)
        discEndDate.setHours(Math.floor(discEnd / 60), discEnd % 60, 0)

        tasks.push({
          id: `${agent.id}-${day}-disc-${idx}`,
          name: `${agent.name} - Desconexión`,
          start: discStartDate,
          end: discEndDate,
          type: "task",
          progress: 100,
          styles: {
            backgroundColor: "#ef4444",
            backgroundSelectedColor: "#dc2626",
            progressColor: "#b91c1c",
            progressSelectedColor: "#991b1b"
          }
        })
      })
    })
  })

  return tasks.sort((a, b) => a.start.getTime() - b.start.getTime())
}

export default function DashboardPilotoPage() {
  const [agents, setAgents] = useState<AgentScheduleData[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day)

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const response = await fetch(`${API_URL}/schedules`)
        if (!response.ok) throw new Error("Error al cargar horarios")
        const data = await response.json()
        setAgents(data)
        const ganttTasks = transformAllAgentsToGantt(data)
        setTasks(ganttTasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }
    fetchSchedules()
  }, [])

  if (loading) return <div className="p-8">Cargando...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>
  if (agents.length === 0) return <div className="p-8">No hay datos de horarios</div>

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vista Piloto - Todos los Agentes</CardTitle>
          <CardDescription>
            Diagrama de Gantt mostrando los horarios de todos los agentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Vista</label>
              <Select
                value={viewMode.toString()}
                onValueChange={(value) => setViewMode(value as ViewMode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ViewMode.Hour}>Por Hora</SelectItem>
                  <SelectItem value={ViewMode.QuarterDay}>Por Cuarto de Día</SelectItem>
                  <SelectItem value={ViewMode.HalfDay}>Por Medio Día</SelectItem>
                  <SelectItem value={ViewMode.Day}>Por Día</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium mb-2">Total de Agentes</div>
              <div className="text-2xl font-bold">{agents.length}</div>
            </div>
          </div>

          <div className="flex gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Agente 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Agente 2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Agente 3</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Agente 4</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 rounded"></div>
              <span>Agente 5</span>
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span>Pausa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Desconexión</span>
            </div>
          </div>

          {tasks.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded border">
              <Gantt
                tasks={tasks}
                viewMode={viewMode}
                locale="es"
                listCellWidth="200px"
                columnWidth={viewMode === ViewMode.Hour ? 60 : 100}
              />
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No hay tareas para mostrar
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
