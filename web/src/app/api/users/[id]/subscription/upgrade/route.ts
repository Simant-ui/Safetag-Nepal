import { jsonError } from '@/lib/apiError';

export async function POST() {
  // Customer self-upgrade is intentionally disabled — only the admin panel
  // (app/api/admin/customers/[userId]/subscription) may change a customer's plan.
  return jsonError(403, 'Only an administrator can change your subscription plan. Please contact support.');
}
