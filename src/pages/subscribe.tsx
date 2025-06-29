import React, { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { useNavigate } from "react-router-dom";

const Subscribe = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // ✅ NEW

  const { setToken, setEmail } = useSubscription();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setEmail(inputEmail);
        localStorage.setItem("subscription_token", data.token);
        localStorage.setItem("subscription_email", inputEmail);
        setInputEmail("");
        setShowModal(true); // ✅ SHOW MODAL

        setTimeout(() => {
          setShowModal(false);
          navigate("/"); // ✅ NAVIGATE AFTER DELAY
        }, 2000); // 2 seconds
      } else {
        setMessage("❌ Subscription failed.");
      }
    } catch (error) {
      console.error("❌ Error subscribing:", error);
      setMessage("❌ Server error.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-techtoniq-blue-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-techtoniq-earth-dark mb-2">Subscribe for Earthquake Alerts</h1>
          <p className="text-techtoniq-earth">Get personalized alerts using our ESP8266-based detector system.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-techtoniq-blue focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-techtoniq-blue hover:bg-techtoniq-blue-dark text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </button>
        </form>

        {message && <p className="mt-4 text-red-600 text-center">{message}</p>}

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Successfully Subscribed!</h2>
              <p className="text-gray-600 mb-6">Thank you for subscribing to our earthquake alerts.</p>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-techtoniq-blue h-2.5 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Redirecting to homepage...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
