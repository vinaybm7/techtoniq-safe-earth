import { ReactNode } from 'react';

export declare const SubscriptionProvider: ({ children }: { children: ReactNode }) => JSX.Element;
export declare const useSubscription: () => {
  token: string | null;
  setToken: (token: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
};