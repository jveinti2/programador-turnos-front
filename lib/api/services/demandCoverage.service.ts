import { apiClient } from '../client';
import type { DemandCoveragePoint } from '@/lib/types/api';

export const demandCoverageService = {
  getDemandCoverage: async (day: number): Promise<DemandCoveragePoint[]> => {
    const response = await apiClient.get<DemandCoveragePoint[]>('/demand-coverage-chart', {
      params: { day },
    });
    return response.data;
  },
};
