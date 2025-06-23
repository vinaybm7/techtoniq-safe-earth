import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create Context
const SubscriptionContext = createContext();

// 2. Create Provider
export const SubscriptionProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);

  // Load from localStorage if it exists
  useEffect(() => {
    const storedToken = localStorage.getItem("subscription_token");
    const storedEmail = localStorage.getItem("subscription_email");

    if (storedToken) setToken(storedToken);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (token) localStorage.setItem("subscription_token", token);
    if (email) localStorage.setItem("subscription_email", email);
  }, [token, email]);

  return (
    <SubscriptionContext.Provider value={{ token, setToken, email, setEmail }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// 3. Custom Hook for easy access
export const useSubscription = () => useContext(SubscriptionContext);
