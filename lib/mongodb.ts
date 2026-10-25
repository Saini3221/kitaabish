import { MongoClient, type Db } from "mongodb";

// Reuse one client across hot reloads in dev and across requests in prod.
const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (see .env.local)");
  globalForMongo._mongoClient ??= new MongoClient(uri).connect();
  const client = await globalForMongo._mongoClient;
  return client.db(process.env.MONGODB_DB || "kitaabish");
}
