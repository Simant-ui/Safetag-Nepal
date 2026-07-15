import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function jsonError(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

/** Central place every route's catch block delegates to, mirroring the old Express errorHandler. */
export function handleRouteError(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError(400, err.errors[0]?.message ?? 'Invalid request.');
  }
  if (err instanceof HttpError) {
    return jsonError(err.status, err.message);
  }
  // eslint-disable-next-line no-console
  console.error(err);
  return jsonError(500, 'Something went wrong. Please try again.');
}
