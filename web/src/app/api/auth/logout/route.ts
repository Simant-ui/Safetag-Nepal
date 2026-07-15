export async function POST() {
  // Stateless JWT — nothing to invalidate server-side in this phase.
  return new Response(null, { status: 204 });
}
