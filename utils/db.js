
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // Use production-safe URI from .env
const dbName = "transitdb";

let dbInstance = null;

async function connectDB() {
  if (dbInstance) return dbInstance;

  try {
    const client = new MongoClient(uri);

    await client.connect();
    dbInstance = client.db(dbName);
    console.log("✅ Connected to MongoDB Atlas");
    return dbInstance;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}

module.exports = connectDB;
