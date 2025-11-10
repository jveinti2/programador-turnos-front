import { BreadcrumbWrapper } from "@/components/breadcrumb-wrapper";
import { SystemPromptPlayground } from "@/components/system-prompt-playground";

export default function SystemPromptPage() {
  return (
    <>
      <BreadcrumbWrapper
        items={[
          { href: "/dashboard", label: "Modelo" },
          { label: "System Prompt", isCurrentPage: true },
        ]}
      />
      <SystemPromptPlayground />
    </>
  );
}
