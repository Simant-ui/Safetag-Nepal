import type { Subscription, SubscriptionPlan } from '@/types/models';
import { mockDb, simulateLatency } from '@/services/mockDb/db';
import type { PlanFeature, SubscriptionService } from './subscriptionService';

// Note: qrTagLimit is rendered as its own line by the frontend (e.g. "1 QR tag" /
// "Unlimited QR tags") — don't repeat that as a features entry too.
const PLANS: PlanFeature[] = [
  {
    plan: 'free',
    priceLabel: 'Free',
    qrTagLimit: 1,
    features: ['Basic profile'],
  },
  {
    plan: 'premium',
    priceLabel: 'Rs. 499/month',
    qrTagLimit: 'unlimited',
    features: ['Call masking', 'Emergency features', 'Scan analytics'],
  },
  {
    plan: 'business',
    priceLabel: 'Rs. 1,999/month',
    qrTagLimit: 'unlimited',
    features: ['Multiple vehicles', 'Team members', 'Business dashboard', 'Everything in Premium'],
  },
];

export class MockSubscriptionService implements SubscriptionService {
  async getCurrent(userId: string): Promise<Subscription> {
    await simulateLatency(80);
    const sub = mockDb.subscriptions.find((s) => s.userId === userId);
    if (sub) return sub;

    const created: Subscription = {
      subscriptionId: mockDb.genId('sub'),
      userId,
      plan: 'free',
      startDate: new Date().toISOString(),
      paymentStatus: 'na',
    };
    mockDb.subscriptions.push(created);
    return created;
  }

  async listPlans(): Promise<PlanFeature[]> {
    await simulateLatency(60);
    return PLANS;
  }

  async upgrade(userId: string, plan: SubscriptionPlan): Promise<Subscription> {
    await simulateLatency(60);
    // Mock-only "payment": in Phase 2 this call happens only after a real eSewa/Khalti/Fonepay
    // webhook confirms payment success.
    let sub = mockDb.subscriptions.find((s) => s.userId === userId);
    if (!sub) {
      sub = {
        subscriptionId: mockDb.genId('sub'),
        userId,
        plan: 'free',
        startDate: new Date().toISOString(),
        paymentStatus: 'na',
      };
      mockDb.subscriptions.push(sub);
    }
    sub.plan = plan;
    sub.paymentStatus = plan === 'free' ? 'na' : 'paid';
    sub.startDate = new Date().toISOString();
    return sub;
  }
}
