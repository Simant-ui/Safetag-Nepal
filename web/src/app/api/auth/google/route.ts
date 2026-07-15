import { jsonError } from '@/lib/apiError';

export async function POST() {
  return jsonError(501, 'Google login requires a configured OAuth client — not set up yet.');
}
