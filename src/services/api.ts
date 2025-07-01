import axios from 'axios';

// Configure API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://techtoniq.vercel.app/api'
    : '/api'
  );

interface SubscriptionResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const subscribeUser = async (email: string): Promise<SubscriptionResponse> => {
  try {
    const url = `${API_BASE_URL}/subscribe`;
    console.log('Making request to:', url);
    
    const response = await axios.post<SubscriptionResponse>(
      url,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status < 500, // Don't throw for 4xx errors
      }
    );

    console.log('Subscription response:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('Error subscribing user:', error);
    
    // Handle different error types
    let errorMessage = 'Failed to subscribe. Please try again.';
    
    if (error.response) {
      // Server responded with a status outside 2xx
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'No response from server. Please check your connection.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    }

    return {
      success: false,
      message: errorMessage
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
