import { apiClient } from "@/lib/api/client";
import type { ReglasYAML } from "@/lib/types";

export const rulesService = {
  async getRules(): Promise<ReglasYAML> {
    return apiClient.get<ReglasYAML>("/get-rules");
  },

  async updateRules(rules: ReglasYAML): Promise<{ message: string }> {
    return apiClient.post<{ message: string }, ReglasYAML>("/update-rules", rules);
  },
};
