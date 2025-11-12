import { apiClient } from '../client';
import type { DashboardMetric } from '@/lib/types/api';

export const metricsService = {
  getDashboardMetrics: async (): Promise<DashboardMetric[]> => {
    const response = await apiClient.get<DashboardMetric[]>('/dashboard-metrics');
    return response.data;
  },
};
