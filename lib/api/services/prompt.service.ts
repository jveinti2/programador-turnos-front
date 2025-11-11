import { apiClient } from "@/lib/api/client";
import type { SystemPromptConfig } from "@/lib/types";

export const promptService = {
  async getPrompt(): Promise<SystemPromptConfig> {
    return apiClient.get<SystemPromptConfig>("/get-prompt");
  },

  async updatePrompt(config: SystemPromptConfig): Promise<{ message: string }> {
    return apiClient.post<{ message: string }, SystemPromptConfig>("/update-prompt", config);
  },
};
