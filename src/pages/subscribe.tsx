import React from 'react';

const subscribe = () => {
  return (
    <div className="min-h-screen p-10 bg-white text-techtoniq-earth-dark">
      <h1 className="text-3xl font-bold mb-4">Subscribe for Earthquake Alerts</h1>
      <p className="mb-6">Get personalized alerts using our ESP8266-based detector system.</p>
      
      <form className="max-w-md">
        <input
          type="email"
          placeholder="Your Email"
          className="mb-4 w-full rounded-md border p-3"
        />
        <button
          type="submit"
          className="w-full bg-techtoniq-blue text-white p-3 rounded-md hover:bg-techtoniq-teal transition"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default subscribe;
