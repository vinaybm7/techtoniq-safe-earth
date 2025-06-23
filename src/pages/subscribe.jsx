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
    <div className="min-h-screen p-10 bg-white text-techtoniq-earth-dark">
      <h1 className="text-3xl font-bold mb-4">Subscribe for Earthquake Alerts</h1>
      <p className="mb-6">Get personalized alerts using our ESP8266-based detector system.</p>

      <form className="max-w-md" onSubmit={handleSubmit}>
        <input
          type="email"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          placeholder="Your Email"
          required
          className="mb-4 w-full rounded-md border p-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-techtoniq-blue text-white p-3 rounded-md hover:bg-techtoniq-teal transition"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {message && <p className="mt-4 text-red-600">{message}</p>}

      {/* ✅ SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-green-600">✅ Subscribed Successfully!</h2>
            <p className="mt-2 text-gray-600">Redirecting to homepage...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscribe;
