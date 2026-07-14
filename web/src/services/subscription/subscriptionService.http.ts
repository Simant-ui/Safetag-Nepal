import { apiClient } from '@/services/api/client';
import type { Subscription, SubscriptionPlan } from '@/types/models';
import type { PlanFeature, SubscriptionService } from './subscriptionService';

export class HttpSubscriptionService implements SubscriptionService {
  async getCurrent(userId: string): Promise<Subscription> {
    return apiClient.get<Subscription>(`/users/${userId}/subscription`);
  }

  async listPlans(): Promise<PlanFeature[]> {
    return apiClient.get<PlanFeature[]>('/subscription-plans');
  }

  async upgrade(userId: string, plan: SubscriptionPlan): Promise<Subscription> {
    // Phase 2: this should be called only after the eSewa/Khalti/Fonepay payment webhook succeeds,
    // not directly from the client — the client instead calls a /checkout endpoint that returns
    // a payment redirect URL, then the backend flips the plan on webhook confirmation.
    return apiClient.post<Subscription>(`/users/${userId}/subscription/upgrade`, { plan });
  }
}
