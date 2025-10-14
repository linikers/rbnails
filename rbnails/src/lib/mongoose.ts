// src/lib/mongoose.ts
import mongoose, { Mongoose } from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Configure as variaveis de ambiente em .env.local'
  );
}

interface Cached {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: Cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: process.env.MONGODB_DB || 'esmalteria', // Use o nome do seu DB
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('Conectado ao MongoDB');
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// export default dbConnect;
