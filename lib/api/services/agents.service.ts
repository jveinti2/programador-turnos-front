import { apiClient } from "@/lib/api/client";

export const agentsService = {
  async getAgentsCsv(): Promise<string> {
    return apiClient.get<string>("/get-agents-csv");
  },

  async updateAgentsCsv(csvContent: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }, string>("/update-agents-csv", csvContent, true);
  },
};
