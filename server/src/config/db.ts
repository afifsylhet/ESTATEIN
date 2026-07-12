import mongoose from 'mongoose';
import { env } from './env';

mongoose.set('strictQuery', true);

export async function connectDB(): Promise<void> {
  try {
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

    await mongoose.connect(env.MONGODB_URI);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
