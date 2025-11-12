import { useQuery } from '@tanstack/react-query';
import { demandCoverageService } from '@/lib/api/services/demandCoverage.service';

export const useDemandCoverage = (day: number) => {
  return useQuery({
    queryKey: ['demand-coverage', day],
    queryFn: () => demandCoverageService.getDemandCoverage(day),
    staleTime: 5 * 60 * 1000,
    enabled: day >= 0 && day <= 6,
  });
};
