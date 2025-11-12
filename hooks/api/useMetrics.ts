import { useQuery } from '@tanstack/react-query';
import { metricsService } from '@/lib/api/services/metrics.service';

export const useMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: metricsService.getDashboardMetrics,
    staleTime: 5 * 60 * 1000,
  });
};
