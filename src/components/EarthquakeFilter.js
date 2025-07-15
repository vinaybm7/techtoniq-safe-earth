import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, MapPin, BarChart, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
const EarthquakeFilter = ({ onFilterChange, displayLimit, onDisplayLimitChange }) => {
    const [filterValues, setFilterValues] = useState({
        minMagnitude: 0,
        maxMagnitude: 10,
        timeframe: 'all',
        region: 'all',
        sortBy: 'latest',
    });
    const [isOpen, setIsOpen] = useState(false);
    const [magnitudeValue, setMagnitudeValue] = useState(filterValues.maxMagnitude);
    // Effect to apply filter changes when sort option changes
    useEffect(() => {
        onFilterChange(filterValues);
    }, [filterValues.sortBy, onFilterChange]);
    const handleFilterValueChange = (key, value) => {
        const newFilterValues = { ...filterValues, [key]: value };
        setFilterValues(newFilterValues);
    };
    const handleMagnitudeChange = (values) => {
        if (values.length === 1) {
            setMagnitudeValue(values[0]);
            setFilterValues(prev => ({
                ...prev,
                minMagnitude: 0,
                maxMagnitude: values[0]
            }));
        }
    };
    const handleApplyFilters = () => {
        onFilterChange(filterValues);
        setIsOpen(false);
    };
    const handleResetFilters = () => {
        const resetValues = {
            minMagnitude: 0,
            maxMagnitude: 10,
            timeframe: 'all',
            region: 'all',
            sortBy: filterValues.sortBy, // Keep current sort option
        };
        setFilterValues(resetValues);
        setMagnitudeValue(10);
        onFilterChange(resetValues);
        setIsOpen(false);
    };
    const handleSortChange = (value) => {
        if (value) {
            handleFilterValueChange('sortBy', value);
        }
    };
    const regions = [
        { value: 'all', label: 'All Regions' },
        { value: 'india', label: 'India (Enhanced Historical Data)' },
        { value: 'asia', label: 'Asia (excluding India)' },
        { value: 'europe', label: 'Europe' },
        { value: 'northamerica', label: 'North America' },
        { value: 'southamerica', label: 'South America' },
        { value: 'africa', label: 'Africa' },
        { value: 'oceania', label: 'Oceania' },
        { value: 'antarctica', label: 'Antarctica' },
    ];
    return (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4", children: [_jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs(Select, { value: displayLimit.toString(), onValueChange: (value) => onDisplayLimitChange(Number(value)), children: [_jsx(SelectTrigger, { className: "w-[120px]", children: _jsx(SelectValue, { placeholder: "Show 10" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "10", children: "Show 10" }), _jsx(SelectItem, { value: "15", children: "Show 15" }), _jsx(SelectItem, { value: "20", children: "Show 20" }), _jsx(SelectItem, { value: "50", children: "Show 50" }), _jsx(SelectItem, { value: "100", children: "Show 100" })] })] }), _jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: "sm", className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-4 w-4" }), _jsx("span", { children: "Filter" })] }) }), _jsx(PopoverContent, { className: "w-80", children: _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium leading-none", children: "Earthquake Filters" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Customize what earthquake data you see" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsxs(Label, { htmlFor: "magnitude", children: ["Maximum Magnitude: ", magnitudeValue.toFixed(1)] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "0.0" }), _jsx(Slider, { id: "magnitude", min: 0, max: 10, step: 0.1, value: [magnitudeValue], onValueChange: handleMagnitudeChange, className: "flex-1" }), _jsx("span", { className: "text-sm", children: "10.0" })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Timeframe" }), _jsxs(ToggleGroup, { type: "single", value: filterValues.timeframe, onValueChange: (value) => {
                                                        if (value)
                                                            handleFilterValueChange('timeframe', value);
                                                    }, className: "justify-start", children: [_jsxs(ToggleGroupItem, { value: "all", "aria-label": "All time", children: [_jsx(Calendar, { className: "h-4 w-4 mr-1" }), " All"] }), _jsx(ToggleGroupItem, { value: "today", "aria-label": "Today", children: "Today" }), _jsx(ToggleGroupItem, { value: "week", "aria-label": "Week", children: "Week" }), _jsx(ToggleGroupItem, { value: "month", "aria-label": "Month", children: "Month" })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "region", children: "Region" }), _jsxs(Select, { value: filterValues.region, onValueChange: (value) => handleFilterValueChange('region', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select region" }) }), _jsx(SelectContent, { children: regions.map((region) => (_jsx(SelectItem, { value: region.value, children: region.label }, region.value))) })] }), filterValues.region === 'india' && (_jsx("p", { className: "text-xs text-blue-600", children: "Shows 10 years of regular data plus older significant earthquakes (M4.5+) from all Indian states and territories" }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: handleResetFilters, children: "Reset" }), _jsx(Button, { size: "sm", onClick: handleApplyFilters, children: "Apply Filters" })] })] }) })] })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(ToggleGroup, { type: "single", value: filterValues.sortBy, onValueChange: (value) => handleSortChange(value), children: [_jsxs(ToggleGroupItem, { value: "latest", "aria-label": "Show latest", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), " Latest"] }), _jsxs(ToggleGroupItem, { value: "magnitude", "aria-label": "Sort by magnitude", children: [_jsx(BarChart, { className: "h-4 w-4 mr-1" }), " Magnitude"] }), _jsxs(ToggleGroupItem, { value: "location", "aria-label": "Group by location", children: [_jsx(MapPin, { className: "h-4 w-4 mr-1" }), " Location"] })] }) })] }));
};
export default EarthquakeFilter;
