import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create Context
const SubscriptionContext = createContext();

// 2. Create Provider
export const SubscriptionProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  // Load from localStorage if it exists
  useEffect(() => {
    const storedToken = localStorage.getItem("subscription_token");
    const storedEmail = localStorage.getItem("subscription_email");

    if (storedToken) setToken(storedToken);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Update premium status when token changes
  useEffect(() => {
    setIsPremium(!!token);
  }, [token]);

  // Save to localStorage on change
  useEffect(() => {
    if (token) {
      localStorage.setItem("subscription_token", token);
    } else {
      localStorage.removeItem("subscription_token");
    }
    
    if (email) {
      localStorage.setItem("subscription_email", email);
    } else {
      localStorage.removeItem("subscription_email");
    }
  }, [token, email]);

  return (
    <SubscriptionContext.Provider value={{ token, setToken, email, setEmail, isPremium }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// 3. Custom Hook for easy access
export const useSubscription = () => useContext(SubscriptionContext);
