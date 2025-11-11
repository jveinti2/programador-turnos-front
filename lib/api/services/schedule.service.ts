import { apiClient } from "@/lib/api/client";
import type {
  GenerateScheduleResponse,
  OptimizeScheduleRequest,
  OptimizeScheduleResponse,
  UpdateScheduleRequest,
  UpdateScheduleResponse,
  AgentScheduleResponse,
} from "@/lib/types";

export const scheduleService = {
  async generateSchedule(): Promise<GenerateScheduleResponse> {
    return apiClient.post<GenerateScheduleResponse>("/generate-schedule");
  },

  async optimizeSchedule(params?: OptimizeScheduleRequest): Promise<OptimizeScheduleResponse> {
    const queryParams = new URLSearchParams();
    if (params?.temperature_override !== undefined) {
      queryParams.append("temperature_override", params.temperature_override.toString());
    }
    if (params?.custom_instructions) {
      queryParams.append("custom_instructions", params.custom_instructions);
    }

    const endpoint = queryParams.toString()
      ? `/optimize-schedule-llm?${queryParams.toString()}`
      : "/optimize-schedule-llm";

    return apiClient.post<OptimizeScheduleResponse>(endpoint);
  },

  async updateSchedule(request: UpdateScheduleRequest): Promise<UpdateScheduleResponse> {
    return apiClient.put<UpdateScheduleResponse, UpdateScheduleRequest>("/update-schedule", request);
  },

  async getAgentSchedule(agentId: string): Promise<AgentScheduleResponse> {
    return apiClient.get<AgentScheduleResponse>(`/schedule/${agentId}`);
  },
};
