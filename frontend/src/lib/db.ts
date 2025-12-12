// ================================
// MongoDB Client Initialization
// ================================

import { MongoClient } from "mongodb";

// ================================
// ENVIRONMENT VARIABLES
// ================================

// MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// ================================
// CLIENT & PROMISE DECLARATION
// ================================

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend the Node.js global type to store the client promise in development
declare global {
  // Prevent multiple MongoClient instances during hot-reloading in development
  var _mongoClientPromise: Promise<MongoClient>;
}

// ================================
// MONGODB CONNECTION LOGIC
// ================================

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve the client across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// ================================
// EXPORT
// ================================

export default clientPromise;
