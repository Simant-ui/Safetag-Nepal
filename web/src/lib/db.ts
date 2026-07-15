import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cached across warm serverless invocations (and HMR in dev) so we don't open a new
// connection on every request — required for Next.js API routes on Vercel.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    if (!MONGODB_URI) throw new Error('Missing required environment variable: MONGODB_URI');
    mongoose.set('strictQuery', true);
    // If this rejects, clear the cached promise so the next call retries fresh instead of
    // replaying the same rejection forever for the lifetime of the warm instance.
    cache.promise = mongoose.connect(MONGODB_URI).catch((err) => {
      cache.promise = null;
      throw err;
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
