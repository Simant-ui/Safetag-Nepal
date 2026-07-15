import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';
import { requireOwnedConversation } from '@/lib/requireOwnedConversation';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const { conversation } = await requireOwnedConversation(params.id, auth.userId);
    conversation.unreadCount = 0;
    await conversation.save();
    return new Response(null, { status: 204 });
  } catch (err) {
    return handleRouteError(err);
  }
}
