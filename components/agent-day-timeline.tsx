"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

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

interface TimelineBlock {
  id: string
  startBlock: number
  endBlock: number
  type: "trabajo" | "pausa" | "desconexion"
  label: string
  startTime: string
  endTime: string
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

const dayNames = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
const dayLabels = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function timeToBlock(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 2 + (minutes >= 30 ? 1 : 0)
}

function blockToTime(block: number): string {
  const hours = Math.floor(block / 2)
  const minutes = (block % 2) * 30
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

function blocksToHours(blocks: number): number {
  return blocks * 0.5
}

function transformDaySchedule(daySchedule: AgentScheduleData["schedule"][string]): TimelineBlock[] {
  const blocks: TimelineBlock[] = []

  const workStartBlock = timeToBlock(daySchedule.start)
  const workEndBlock = timeToBlock(daySchedule.end)

  const breakBlocks = new Set<number>()
  daySchedule.break?.forEach((breakPeriod) => {
    const start = timeToBlock(breakPeriod.start)
    const end = timeToBlock(breakPeriod.end)
    for (let i = start; i < end; i++) {
      breakBlocks.add(i)
    }
  })

  const disconnectedBlocks = new Set<number>()
  daySchedule.disconnected?.forEach((discPeriod) => {
    const start = timeToBlock(discPeriod.start)
    const end = timeToBlock(discPeriod.end)
    for (let i = start; i < end; i++) {
      disconnectedBlocks.add(i)
    }
  })

  let currentBlock = workStartBlock
  while (currentBlock < workEndBlock) {
    if (breakBlocks.has(currentBlock)) {
      const segmentStart = currentBlock
      while (currentBlock < workEndBlock && breakBlocks.has(currentBlock)) {
        currentBlock++
      }
      blocks.push({
        id: `break-${segmentStart}`,
        startBlock: segmentStart,
        endBlock: currentBlock,
        type: "pausa",
        label: "Pausa",
        startTime: blockToTime(segmentStart),
        endTime: blockToTime(currentBlock),
      })
    } else if (disconnectedBlocks.has(currentBlock)) {
      const segmentStart = currentBlock
      while (currentBlock < workEndBlock && disconnectedBlocks.has(currentBlock)) {
        currentBlock++
      }
      blocks.push({
        id: `disc-${segmentStart}`,
        startBlock: segmentStart,
        endBlock: currentBlock,
        type: "desconexion",
        label: "Desconexión",
        startTime: blockToTime(segmentStart),
        endTime: blockToTime(currentBlock),
      })
    } else {
      const segmentStart = currentBlock
      while (
        currentBlock < workEndBlock &&
        !breakBlocks.has(currentBlock) &&
        !disconnectedBlocks.has(currentBlock)
      ) {
        currentBlock++
      }
      blocks.push({
        id: `work-${segmentStart}`,
        startBlock: segmentStart,
        endBlock: currentBlock,
        type: "trabajo",
        label: "Trabajo",
        startTime: blockToTime(segmentStart),
        endTime: blockToTime(currentBlock),
      })
    }
  }

  return blocks
}

function getBlockColor(type: TimelineBlock["type"]): string {
  switch (type) {
    case "trabajo":
      return "bg-blue-500 hover:bg-blue-600"
    case "pausa":
      return "bg-green-400 hover:bg-green-500"
    case "desconexion":
      return "bg-red-500 hover:bg-red-600"
    default:
      return "bg-gray-500"
  }
}

export function AgentDayTimeline() {
  const [agents, setAgents] = useState<AgentScheduleData[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string>("")
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await fetch(`${API_URL}/schedules`)
        if (!response.ok) throw new Error("Error al cargar agentes")
        const data = await response.json()
        setAgents(data)
        if (data.length > 0) {
          setSelectedAgentId(data[0].id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  if (agents.length === 0) {
    return <div className="p-8">No hay datos de horarios</div>
  }

  const selectedAgent = agents.find((a) => a.id === selectedAgentId)
  if (!selectedAgent) return null

  const dayKey = dayNames[selectedDay]
  const daySchedule = Object.keys(selectedAgent.schedule).find(
    (key) => key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === dayKey
  )

  if (!daySchedule || !selectedAgent.schedule[daySchedule]) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Horario por Agente - Vista Diaria</CardTitle>
          <CardDescription>
            Vista detallada del horario de un agente en un día específico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Agente</label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name} ({agent.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Día</label>
              <Select value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dayLabels.map((label, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-4 text-center text-muted-foreground">
            No hay horario programado para este día
          </div>
        </CardContent>
      </Card>
    )
  }

  const schedule = selectedAgent.schedule[daySchedule]
  const blocks = transformDaySchedule(schedule)

  const workBlocks = blocks.filter((b) => b.type === "trabajo")
  const breakBlocks = blocks.filter((b) => b.type === "pausa")
  const discBlocks = blocks.filter((b) => b.type === "desconexion")

  const totalWorkBlocks = workBlocks.reduce((sum, b) => sum + (b.endBlock - b.startBlock), 0)
  const totalBreakBlocks = breakBlocks.reduce((sum, b) => sum + (b.endBlock - b.startBlock), 0)
  const totalDiscBlocks = discBlocks.reduce((sum, b) => sum + (b.endBlock - b.startBlock), 0)

  const firstBlock = Math.min(...blocks.map((b) => b.startBlock))
  const lastBlock = Math.max(...blocks.map((b) => b.endBlock))
  const totalShiftBlocks = lastBlock - firstBlock

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horario por Agente - Vista Diaria</CardTitle>
        <CardDescription>
          Vista detallada del horario de un agente en un día específico
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Agente</label>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Día</label>
            <Select value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dayLabels.map((label, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Timeline - {dayLabels[selectedDay]}</div>
          <div className="relative bg-gray-50 dark:bg-gray-900 border rounded-lg p-4 overflow-x-auto">
            <div className="min-w-[1200px]">
              <div className="flex text-xs text-muted-foreground mb-2 relative">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center border-l border-gray-200 dark:border-gray-700 h-4"
                    style={{ minWidth: "25px" }}
                  >
                    {i % 2 === 0 ? blockToTime(i) : ""}
                  </div>
                ))}
              </div>

              <div className="relative h-16 bg-white dark:bg-gray-800 rounded border">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className={`absolute h-12 rounded text-white text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${getBlockColor(
                      block.type
                    )}`}
                    style={{
                      left: `${(block.startBlock / 48) * 100}%`,
                      width: `${((block.endBlock - block.startBlock) / 48) * 100}%`,
                      top: "8px",
                    }}
                    title={`${block.label}: ${block.startTime} - ${block.endTime}`}
                  >
                    <span className="truncate px-1">{block.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Trabajo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Pausa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Desconexión</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-sm font-medium mb-3">Resumen del Turno</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Trabajo Efectivo</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {blocksToHours(totalWorkBlocks).toFixed(1)}h
              </div>
              <div className="text-xs text-muted-foreground">{totalWorkBlocks} bloques × 30min</div>
            </div>

            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Descansos</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {blocksToHours(totalBreakBlocks).toFixed(1)}h
              </div>
              <div className="text-xs text-muted-foreground">{totalBreakBlocks} bloques × 30min</div>
            </div>

            <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Desconexión</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {blocksToHours(totalDiscBlocks).toFixed(1)}h
              </div>
              <div className="text-xs text-muted-foreground">{totalDiscBlocks} bloques × 30min</div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Total Turno</div>
              <div className="text-2xl font-bold">
                {blocksToHours(totalShiftBlocks).toFixed(1)}h
              </div>
              <div className="text-xs text-muted-foreground">{totalShiftBlocks} bloques × 30min</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
