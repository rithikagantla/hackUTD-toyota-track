import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | null = null;

export function connectDatabase(uri?: string): Promise<typeof mongoose> {
  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required to use Plaid integration.');
  }

  connectionPromise = mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  connectionPromise
    .then(() => {
      if (process.env.NODE_ENV !== 'test') {
        console.log('✅ Connected to MongoDB');
      }
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error', error);
      connectionPromise = null;
    });

  return connectionPromise;
}

