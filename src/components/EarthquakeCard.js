import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Activity, Calendar, MapPin } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
const EarthquakeCard = ({ magnitude, location, date, depth, url, coordinates }) => {
    // Determine color based on magnitude
    const getMagnitudeColor = (mag) => {
        if (mag >= 7)
            return "bg-red-600 hover:bg-red-700";
        if (mag >= 5)
            return "bg-techtoniq-alert hover:bg-techtoniq-alert-dark";
        if (mag >= 3)
            return "bg-techtoniq-warning hover:bg-techtoniq-warning-dark";
        return "bg-techtoniq-teal hover:bg-techtoniq-teal-dark";
    };
    // Format date in IST
    const formatDateInIST = (dateStr) => {
        try {
            // Check if it's already a properly formatted date
            if (dateStr.includes('GMT+5:30') || dateStr.includes('IST')) {
                return dateStr;
            }
            // Handle special date formats that are causing errors
            if (dateStr.includes('Today') || dateStr.includes('Yesterday')) {
                return dateStr; // Return as is for now
            }
            // Handle formats like "April 15, 2025, 08:12 AM"
            if (/[A-Za-z]+ \d+, \d{4}, \d{2}:\d{2} [AP]M/.test(dateStr)) {
                return dateStr + ' IST'; // Just add IST to make it clear
            }
            // Parse the date string
            let parsedDate;
            try {
                // Try parsing as ISO date first
                parsedDate = parseISO(dateStr);
            }
            catch (e) {
                // If that fails, try as regular date
                parsedDate = new Date(dateStr);
            }
            // Check if date is valid
            if (isNaN(parsedDate.getTime())) {
                // Don't throw error, just return original
                return dateStr;
            }
            // Format to Indian Standard Time using date-fns-tz
            return formatInTimeZone(parsedDate, 'Asia/Kolkata', 'MMM d, yyyy, hh:mm a \'IST\'');
        }
        catch (error) {
            // Log error but don't crash
            console.log("Date formatting handled gracefully for:", dateStr);
            return dateStr; // Return original string if formatting fails
        }
    };
    // Format the local time based on earthquake coordinates
    const getLocalTime = () => {
        try {
            if (!coordinates)
                return null;
            // Convert coordinates to timezone estimation
            const [longitude] = coordinates;
            const hours = Math.round(longitude / 15); // Each 15 degrees is roughly 1 hour time difference
            const date = new Date();
            const utcHours = date.getUTCHours();
            const localHour = (utcHours + hours + 24) % 24; // Add 24 and mod 24 to handle negative values
            return `~${localHour}:${date.getUTCMinutes().toString().padStart(2, '0')} local time`;
        }
        catch (error) {
            console.error("Local time calculation error:", error);
            return null;
        }
    };
    // Get local time string
    const localTime = getLocalTime();
    return (_jsx(Card, { className: "overflow-hidden transition-all hover:shadow-md", children: _jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: "block", children: _jsxs("div", { className: "relative bg-white p-5", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "mb-1 font-medium", children: location }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm text-techtoniq-earth", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: formatDateInIST(date) })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-4 w-4" }), _jsxs("span", { children: [depth, " km depth"] })] })] }), localTime && (_jsx("div", { className: "mt-1 text-xs text-techtoniq-teal-dark", children: localTime }))] }), _jsx(Badge, { className: `flex h-10 w-10 items-center justify-center rounded-full text-lg ${getMagnitudeColor(magnitude)}`, children: magnitude.toFixed(1) })] }), _jsxs("div", { className: "mt-4 flex items-center gap-2", children: [_jsx(Activity, { className: "h-4 w-4 text-techtoniq-earth" }), _jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-gray-200", children: _jsx("div", { className: `h-full ${getMagnitudeColor(magnitude)}`, style: { width: `${Math.min(magnitude * 10, 100)}%` } }) })] })] }) }) }));
};
export default EarthquakeCard;
