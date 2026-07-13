import mongoose from 'mongoose';
import { env } from './env';

mongoose.set('strictQuery', true);

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  listenersAttached: boolean;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.__mongooseCache ?? {
  conn: null,
  promise: null,
  listenersAttached: false,
};

global.__mongooseCache = cache;

function attachConnectionListeners(): void {
  if (cache.listenersAttached) return;

  cache.listenersAttached = true;
  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log('✅ MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('⚠️  MongoDB disconnected');
  });
}

export async function connectDB(): Promise<typeof mongoose> {
  try {
    if (cache.conn) return cache.conn;

    attachConnectionListeners();

    if (!cache.promise) {
      cache.promise = mongoose.connect(env.MONGODB_URI).then((instance) => {
        cache.conn = instance;
        return instance;
      });
    }

    return await cache.promise;
  } catch (err) {
    cache.promise = null;
    // eslint-disable-next-line no-console
    console.error('❌ Failed to connect to MongoDB:', err);
    throw err;
  }
}

export async function disconnectDB(): Promise<void> {
  cache.conn = null;
  cache.promise = null;
  await mongoose.disconnect();
}
