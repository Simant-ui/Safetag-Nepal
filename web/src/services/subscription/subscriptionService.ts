import type { Subscription, SubscriptionPlan } from '@/types/models';

export interface PlanFeature {
  plan: SubscriptionPlan;
  priceLabel: string;
  qrTagLimit: number | 'unlimited';
  features: string[];
}

export interface SubscriptionService {
  getCurrent(userId: string): Promise<Subscription>;
  listPlans(): Promise<PlanFeature[]>;
  /** Mock only in this phase — real eSewa/Khalti/Fonepay checkout is a Phase 2 integration. */
  upgrade(userId: string, plan: SubscriptionPlan): Promise<Subscription>;
}
