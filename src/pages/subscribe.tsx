import React, { useState, useEffect } from "react";
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
  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      const subscribed = await checkSubscription(newEmail);
      setIsSubscribed(subscribed);
    } else {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        setError(result.message || "Subscription failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-techtoniq-blue-light to-white">
      <Header />
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md p-8 rounded-xl shadow-lg">
          <CardHeader>
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-techtoniq-blue transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Subscribe</span>
                  </div>
                </li>
              </ol>
            </nav>
            <CardTitle className="text-3xl font-bold text-techtoniq-earth-dark mb-2">Subscribe for Earthquake Alerts</CardTitle>
            <CardDescription className="text-techtoniq-earth">Get personalized alerts using our ESP8266-based detector system.</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Successfully Subscribed!</h2>
                <p className="text-gray-600 mb-4 text-center">Thank you for subscribing to our earthquake alerts. Redirecting to home page with your premium badge...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-techtoniq-blue" />
                  <Input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    required
                    className="flex-1"
                  />
                </div>
                {isSubscribed ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 w-full rounded-md bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2 text-sm font-medium text-white">
                      <span className="animate-pulse">⭐</span>
                      <span>Already Subscribed</span>
                    </div>
                    <Button onClick={handleLogout} className="w-full bg-techtoniq-earth-dark hover:bg-techtoniq-earth">
                      Logout from Subscription
                    </Button>
                  </div>
                ) : (
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Subscribing...' : 'Subscribe Now'}
                  </Button>
                )}
                {error && <div className="text-red-600 text-center font-medium mt-2">{error}</div>}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscribe;