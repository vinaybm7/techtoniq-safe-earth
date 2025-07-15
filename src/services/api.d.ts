interface SubscriptionResponse {
    success: boolean;
    message: string;
    token?: string;
}
export declare const subscribeUser: (email: string) => Promise<SubscriptionResponse>;
export declare const checkSubscription: (email: string) => Promise<boolean>;
export {};
