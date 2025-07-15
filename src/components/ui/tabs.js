import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
const Tabs = TabsPrimitive.Root;
const MobileTabsDropdown = ({ value, onValueChange, options, className = "", }) => (_jsx("select", { className: cn("block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm md:hidden mb-4", className), value: value, onChange: e => onValueChange(e.target.value), children: options.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) }));
const TabsList = React.forwardRef(({ className, ...props }, ref) => (_jsx(TabsPrimitive.List, { ref: ref, className: cn(
    // Add horizontal scroll and responsive tweaks
    "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 md:overflow-x-visible w-full md:w-auto md:grid md:grid-cols-3 gap-1 md:gap-0", className), ...props })));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (_jsx(TabsPrimitive.Trigger, { ref: ref, className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className), ...props })));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (_jsx(TabsPrimitive.Content, { ref: ref, className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className), ...props })));
TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent, MobileTabsDropdown };
