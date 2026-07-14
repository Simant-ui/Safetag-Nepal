'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useAuthStore } from '@/store/authStore';
import { subscriptionService } from '@/services';
import type { PlanFeature } from '@/services/subscription/subscriptionService';
import type { Subscription } from '@/types/models';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@/constants/appConfig';
import { formatDate } from '@/utils/formatters';

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const [plans, setPlans] = React.useState<PlanFeature[]>([]);
  const [current, setCurrent] = React.useState<Subscription | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    Promise.all([subscriptionService.listPlans(), subscriptionService.getCurrent(user.userId)]).then(
      ([p, c]) => {
        setPlans(p);
        setCurrent(c);
        setLoading(false);
      },
    );
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h2" sx={{ fontSize: 22, mb: 0.5 }}>
        Subscription
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Your current plan and what each tier includes.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Plan changes are handled by our team — contact {SUPPORT_EMAIL} or {SUPPORT_PHONE} to
        upgrade or renew.
      </Alert>

      <Stack spacing={2}>
        {plans.map((plan) => {
          const isCurrent = current?.plan === plan.plan;
          return (
            <Card
              key={plan.plan}
              variant="outlined"
              sx={{ p: 2.5, borderColor: isCurrent ? 'primary.main' : undefined, borderWidth: isCurrent ? 2 : 1 }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h3" sx={{ fontSize: 18, textTransform: 'capitalize' }}>
                  {plan.plan}
                </Typography>
                {isCurrent && <Chip size="small" color="primary" label="Your current plan" />}
              </Stack>
              <Typography variant="h2" sx={{ fontSize: 22, color: 'primary.main', mb: 1.5 }}>
                {plan.priceLabel}
              </Typography>
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckRoundedIcon fontSize="small" color="primary" />
                  <Typography variant="body2">
                    {plan.qrTagLimit === 'unlimited' ? 'Unlimited QR tags' : `${plan.qrTagLimit} QR tag`}
                  </Typography>
                </Stack>
                {plan.features.map((f) => (
                  <Stack direction="row" spacing={1} alignItems="center" key={f}>
                    <CheckRoundedIcon fontSize="small" color="primary" />
                    <Typography variant="body2">{f}</Typography>
                  </Stack>
                ))}
              </Stack>
              {isCurrent && current?.endDate && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                  Renews/expires {formatDate(current.endDate)}.
                </Typography>
              )}
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
