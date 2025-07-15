import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
const Premium = () => {
    const navigate = useNavigate();
    const handleUpgrade = () => {
        // Placeholder for payment gateway logic
        alert("Redirecting to payment gateway...");
        // navigate("/payment");
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center p-6", children: _jsxs("div", { className: "bg-white shadow-xl rounded-2xl p-10 max-w-3xl w-full text-techtoniq-earth-dark", children: [_jsx("h1", { className: "text-4xl font-bold mb-4 text-center text-techtoniq-blue", children: "\uD83C\uDF10 Premium Plan" }), _jsx("p", { className: "text-center mb-8 text-gray-600", children: "Enhance your safety with our premium earthquake alert service." }), _jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "\uD83D\uDE80 Features You Get:" }), _jsxs("ul", { className: "list-disc list-inside text-gray-700 space-y-2", children: [_jsx("li", { children: "Instant Earthquake Alerts (SMS + Email)" }), _jsx("li", { children: "Priority Access to ESP8266 Detector" }), _jsx("li", { children: "Real-Time Seismic Data Dashboard" }), _jsx("li", { children: "Location-based Early Warnings" }), _jsx("li", { children: "24/7 Expert Support" })] })] }), _jsxs("div", { className: "bg-gray-50 p-6 rounded-lg shadow-md flex flex-col justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-techtoniq-teal mb-2", children: "\u20B9299 / year" }), _jsx("p", { className: "text-sm text-gray-500 mb-6", children: "Billed annually. Cancel anytime." })] }), _jsx("button", { onClick: handleUpgrade, className: "bg-techtoniq-blue text-white px-6 py-3 rounded-md hover:bg-techtoniq-teal transition text-lg", children: "Upgrade to Premium" })] })] }), _jsxs("p", { className: "mt-8 text-center text-sm text-gray-400", children: ["Need help?", " ", _jsx("span", { onClick: () => navigate("/contact"), className: "text-techtoniq-blue hover:underline cursor-pointer", children: "Contact Support" })] })] }) }));
};
export default Premium;
