import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
const PageBreadcrumbs = ({ items }) => {
    return (_jsx("div", { className: "container py-4", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground", children: [_jsx(ChevronLeft, { className: "h-4 w-4" }), "Back"] }), _jsx(Breadcrumb, { children: _jsxs(BreadcrumbList, { children: [_jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }), items.map((item, index) => (_jsxs(BreadcrumbItem, { children: [_jsx(BreadcrumbSeparator, {}), index === items.length - 1 ? (_jsx(BreadcrumbPage, { children: item.label })) : (_jsx(BreadcrumbLink, { href: item.href, children: item.label }))] }, index)))] }) })] }) }));
};
export default PageBreadcrumbs;
