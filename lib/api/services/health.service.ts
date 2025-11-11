import { apiClient } from "@/lib/api/client";
import type { HealthResponse } from "@/lib/types";

export const healthService = {
  async checkHealth(): Promise<HealthResponse> {
    return apiClient.get<HealthResponse>("/health");
  },
};
