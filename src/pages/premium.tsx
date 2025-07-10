import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useSubscription } from "../context/SubscriptionContext";

const Premium: React.FC = () => {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();

  // Redirect non-premium users to subscribe page
  useEffect(() => {
    if (!isPremium) {
      navigate("/subscribe");
    }
  }, [isPremium, navigate]);

  const handleUpgrade = (): void => {
    // Placeholder for payment gateway logic
    alert("Redirecting to payment gateway...");
    // navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-3xl w-full text-techtoniq-earth-dark">
        <h1 className="text-4xl font-bold mb-4 text-center text-techtoniq-blue">🌐 Premium Plan</h1>
        <p className="text-center mb-8 text-gray-600">
          Enhance your safety with our premium earthquake alert service.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-2">🚀 Features You Get:</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Instant Earthquake Alerts (SMS + Email)</li>
              <li>Priority Access to ESP8266 Detector</li>
              <li>Real-Time Seismic Data Dashboard</li>
              <li>Location-based Early Warnings</li>
              <li>24/7 Expert Support</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-techtoniq-teal mb-2">₹299 / year</h3>
              <p className="text-sm text-gray-500 mb-6">Billed annually. Cancel anytime.</p>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-techtoniq-blue text-white px-6 py-3 rounded-md hover:bg-techtoniq-teal transition text-lg"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Need help?{" "}
          <span
            onClick={() => navigate("/contact")}
            className="text-techtoniq-blue hover:underline cursor-pointer"
          >
            Contact Support
          </span>
        </p>
      </div>
    </div>
  </div>
  );
};

export default Premium;
