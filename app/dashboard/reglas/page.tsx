import { BreadcrumbWrapper } from "@/components/breadcrumb-wrapper";
import { ReglasForm } from "@/components/reglas-form";

export default function ReglasPage() {
  return (
    <>
      <BreadcrumbWrapper
        items={[
          { href: "/dashboard", label: "Configuración" },
          { label: "Reglas", isCurrentPage: true },
        ]}
      />
      <ReglasForm />
    </>
  );
}
