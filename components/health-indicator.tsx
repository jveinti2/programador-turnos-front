"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { useHealth } from "@/hooks/api";

export function HealthIndicator() {
  const { health, loading, error, checkHealth } = useHealth();
  const [autoRefresh, setAutoRefresh] = React.useState(false);

  React.useEffect(() => {
    checkHealth();
  }, []);

  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      checkHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, checkHealth]);

  const getStatusColor = () => {
    if (loading) return "bg-gray-500";
    if (error) return "bg-red-500";
    if (health?.status === "healthy" || health?.status === "ok") return "bg-green-500";
    return "bg-yellow-500";
  };

  const getStatusText = () => {
    if (loading) return "Verificando...";
    if (error) return "Desconectado";
    if (health?.status === "healthy" || health?.status === "ok") return "Conectado";
    return health?.status || "Desconocido";
  };

  const getStatusIcon = () => {
    if (loading) {
      return <Loader2 className="h-3 w-3 animate-spin" />;
    }
    if (error) {
      return <XCircle className="h-3 w-3" />;
    }
    if (health?.status === "healthy" || health?.status === "ok") {
      return <CheckCircle2 className="h-3 w-3" />;
    }
    return null;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => checkHealth()}
            >
              <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
              <span className="text-xs">API {getStatusText()}</span>
              {getStatusIcon()}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${autoRefresh ? "text-green-500" : ""}`}
              />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">Estado de la API</p>
            <p className="text-xs">
              {health?.status === "healthy" || health?.status === "ok"
                ? "El backend está funcionando correctamente"
                : error
                ? `Error: ${error}`
                : "Estado desconocido"}
            </p>
            {health?.timestamp && (
              <p className="text-xs text-muted-foreground">
                Última verificación: {new Date(health.timestamp).toLocaleTimeString()}
              </p>
            )}
            {autoRefresh && (
              <p className="text-xs text-green-600">
                Auto-refresh activo (cada 30s)
              </p>
            )}
            <p className="text-xs text-muted-foreground pt-1 border-t">
              Click en el badge para verificar manualmente
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
