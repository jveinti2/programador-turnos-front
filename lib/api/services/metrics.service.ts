import { apiClient } from '../client';
import type { DashboardMetric } from '@/lib/types/api';

export const metricsService = {
  getDashboardMetrics: async (): Promise<DashboardMetric[]> => {
    return await apiClient.get<DashboardMetric[]>('/dashboard-metrics');
  },
};
