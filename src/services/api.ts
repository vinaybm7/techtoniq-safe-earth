import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://techtoniq-safe-earth.vercel.app/api'  // Replace with your actual Vercel/Netlify URL if different
  : '/api';

interface SubscriptionResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const subscribeUser = async (email: string): Promise<SubscriptionResponse> => {
  try {
    const response = await axios.post<SubscriptionResponse>(
      `${API_BASE_URL}/subscribe`,
      { email }
    );
    return response.data;
  } catch (error) {
    console.error('Error subscribing user:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to subscribe. Please try again.'
    };
  }
};

export const checkSubscription = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.get<{ isSubscribed: boolean }>(
      `${API_BASE_URL}/subscription/status`,
      { params: { email } }
    );
    return response.data.isSubscribed;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
};
