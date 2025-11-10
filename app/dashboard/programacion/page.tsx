import { BreadcrumbWrapper } from "@/components/breadcrumb-wrapper";
import { ProgramacionForm } from "@/components/programacion-form";

export default function ProgramacionPage() {
  return (
    <>
      <BreadcrumbWrapper
        items={[
          { href: "/dashboard", label: "Turnos" },
          { label: "Programación", isCurrentPage: true },
        ]}
      />
      <ProgramacionForm />
    </>
  );
}
