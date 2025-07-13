const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017"; // Local MongoDB connection
const dbName = "transitdb";

let dbInstance = null;

async function connectDB() {
  if (dbInstance) return dbInstance;

  const client = new MongoClient(uri);
  await client.connect();
  dbInstance = client.db(dbName);
  return dbInstance;
}

module.exports = connectDB;
