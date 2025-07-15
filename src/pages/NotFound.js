import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, Home } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
const NotFound = () => {
    const location = useLocation();
    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);
    return (_jsx(PageLayout, { children: _jsxs("div", { className: "container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center", children: [_jsx("div", { className: "animate-pulse-slow mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-techtoniq-blue-light", children: _jsx(AlertTriangle, { className: "h-12 w-12 text-techtoniq-blue" }) }), _jsx("h1", { className: "mb-4 text-6xl font-bold text-techtoniq-earth-dark", children: "404" }), _jsx("p", { className: "mb-8 text-xl text-techtoniq-earth", children: "Oops! The page you're looking for can't be found." }), _jsxs("p", { className: "mb-12 max-w-md text-techtoniq-earth", children: ["The page at ", _jsx("span", { className: "font-mono text-techtoniq-earth-dark", children: location.pathname }), " doesn't exist. It might have been moved, deleted, or perhaps it never existed at all."] }), _jsx(Button, { asChild: true, className: "flex items-center gap-2 bg-techtoniq-blue hover:bg-techtoniq-blue-dark", children: _jsxs(Link, { to: "/", children: [_jsx(Home, { className: "h-4 w-4" }), _jsx("span", { children: "Return to Home" })] }) })] }) }));
};
export default NotFound;
