import axios from 'axios';

// For production, use the full URL if VITE_API_URL is set, otherwise use relative URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface SubscriptionResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const subscribeUser = async (email: string): Promise<SubscriptionResponse> => {
  try {
    console.log('Making request to:', `${API_BASE_URL}/subscribe`);
    const response = await axios.post<SubscriptionResponse>(
      `${API_BASE_URL}/subscribe`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    console.log('Subscription response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error subscribing user:', error);
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to subscribe. Please try again.';
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
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
