import { BreadcrumbWrapper } from "@/components/breadcrumb-wrapper";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { DemandCoverageChart } from "@/components/demand-coverage-chart";

export default function Page() {
  return (
    <>
      <BreadcrumbWrapper
        items={[
          { href: "#", label: "Dashboard" },
          { label: "Inicio", isCurrentPage: true },
        ]}
      />
      <div className="flex flex-col gap-4">
        <DashboardMetrics />
        <DemandCoverageChart />
      </div>
    </>
  );
}
