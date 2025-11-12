"use client"

import { Users, UserCheck, TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMetrics } from "@/hooks/api/useMetrics"
import { Skeleton } from "@/components/ui/skeleton"

const iconMap: Record<string, typeof Users> = {
  "Agentes Disponibles": Users,
  "Agentes Requeridos": UserCheck,
  "Nivel de Servicio": TrendingUp,
}

const colorMap: Record<string, string> = {
  "Agentes Disponibles": "text-blue-600",
  "Agentes Requeridos": "text-orange-600",
  "Nivel de Servicio": "text-green-600",
}

export function DashboardMetrics() {
  const { data: metrics, isLoading, error } = useMetrics()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Error cargando métricas</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.title] || Users
        const color = colorMap[metric.title] || "text-gray-600"

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
