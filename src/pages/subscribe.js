import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Header from "../components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { subscribeUser, checkSubscription } from "@/services/api";
import { useSubscription } from "../context/SubscriptionContext";
const Subscribe = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const navigate = useNavigate();
    const { setToken, setEmail: setSubscriptionEmail, token } = useSubscription();
    // Check subscription status when email changes
    const handleEmailChange = async (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            const subscribed = await checkSubscription(newEmail);
            setIsSubscribed(subscribed);
        }
        else {
            setIsSubscribed(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("subscription_token");
        localStorage.removeItem("subscription_email");
        setToken(null);
        setSubscriptionEmail(null);
        setEmail("");
        setIsSubscribed(false);
        navigate("/");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        try {
            const result = await subscribeUser(email);
            if (result.success) {
                setSuccess(true);
                // Set subscription state
                const subscriptionToken = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                setToken(subscriptionToken);
                setSubscriptionEmail(email);
                setEmail("");
                // Redirect to home page with premium badge after a short delay
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
            else {
                setError(result.message || "Subscription failed. Please try again.");
            }
        }
        catch (error) {
            setError("An unexpected error occurred. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-techtoniq-blue-light to-white", children: [_jsx(Header, {}), _jsx("div", { className: "container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]", children: _jsxs(Card, { className: "w-full max-w-md p-8 rounded-xl shadow-lg", children: [_jsxs(CardHeader, { children: [_jsx("nav", { className: "flex mb-4", "aria-label": "Breadcrumb", children: _jsxs("ol", { className: "inline-flex items-center space-x-1 md:space-x-2", children: [_jsx("li", { className: "inline-flex items-center", children: _jsxs(Link, { to: "/", className: "inline-flex items-center text-sm font-medium text-gray-700 hover:text-techtoniq-blue transition-colors", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" }) }), "Home"] }) }), _jsx("li", { children: _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-6 h-6 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) }), _jsx("span", { className: "ml-1 text-sm font-medium text-gray-500 md:ml-2", children: "Subscribe" })] }) })] }) }), _jsx(CardTitle, { className: "text-3xl font-bold text-techtoniq-earth-dark mb-2", children: "Subscribe for Earthquake Alerts" }), _jsx(CardDescription, { className: "text-techtoniq-earth", children: "Get personalized alerts using our ESP8266-based detector system." })] }), _jsx(CardContent, { children: success ? (_jsxs("div", { className: "flex flex-col items-center py-8", children: [_jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4", children: _jsx(CheckCircle2, { className: "w-8 h-8 text-green-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Successfully Subscribed!" }), _jsx("p", { className: "text-gray-600 mb-4 text-center", children: "Thank you for subscribing to our earthquake alerts. Redirecting to home page with your premium badge..." })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-5 w-5 text-techtoniq-blue" }), _jsx(Input, { type: "email", value: email, onChange: handleEmailChange, placeholder: "Enter your email address", required: true, className: "flex-1" })] }), isSubscribed ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 w-full rounded-md bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2 text-sm font-medium text-white", children: [_jsx("span", { className: "animate-pulse", children: "\u2B50" }), _jsx("span", { children: "Already Subscribed" })] }), _jsx(Button, { onClick: handleLogout, className: "w-full bg-techtoniq-earth-dark hover:bg-techtoniq-earth", children: "Logout from Subscription" })] })) : (_jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? 'Subscribing...' : 'Subscribe Now' })), error && _jsx("div", { className: "text-red-600 text-center font-medium mt-2", children: error })] })) })] }) })] }));
};
export default Subscribe;
