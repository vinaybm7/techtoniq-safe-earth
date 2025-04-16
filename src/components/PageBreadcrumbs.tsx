
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageBreadcrumbsProps {
  items: {
    href?: string;
    label: string;
  }[];
}

const PageBreadcrumbs = ({ items }: PageBreadcrumbsProps) => {
  return (
    <div className="container py-4">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {items.map((item, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbSeparator />
                {index === items.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default PageBreadcrumbs;
