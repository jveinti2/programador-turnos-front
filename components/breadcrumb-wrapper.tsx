"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  href?: string;
  label: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbWrapperProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbWrapper({ items }: BreadcrumbWrapperProps) {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const breadcrumbContainer = document.getElementById("breadcrumb-container");
    setContainer(breadcrumbContainer);
  }, []);

  if (!container) return null;

  return createPortal(
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className="hidden md:block">
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>,
    container
  );
}
