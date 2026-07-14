import * as React from 'react';
import { subscriptionService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import type { Subscription, SubscriptionPlan } from '@/types/models';

export const PLAN_QR_LIMIT: Record<SubscriptionPlan, number | null> = {
  free: 1,
  premium: null,
  business: null,
};

export function useSubscription() {
  const user = useAuthStore((s) => s.user);
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    subscriptionService.getCurrent(user.userId).then((sub) => {
      setSubscription(sub);
      setLoading(false);
    });
  }, [user]);

  const plan: SubscriptionPlan = subscription?.plan ?? 'free';
  const qrLimit = PLAN_QR_LIMIT[plan];

  return { subscription, plan, qrLimit, loading };
}
