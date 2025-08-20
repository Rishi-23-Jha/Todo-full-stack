// test.js - CommonJS version that works with Next.js
require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
console.log("Mongo URI:", uri ? "✓ Found" : "✗ Missing");
console.log("First 50 chars:", uri ? uri.substring(0, 50) + "..." : "None");

if (!uri) {
  console.error("❌ MONGODB_URI not found in .env.local");
  console.error("Make sure .env.local exists in root directory with:");
  console.error("MONGODB_URI=mongodb+srv://...");
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected successfully!");

    // Use the same database name as your route.js
    const db = client.db("todo-app");
    const todos = await db.collection("todos").find({}).toArray();

    console.log(`📊 Found ${todos.length} todos:`, todos);

    // Test inserting a sample todo
    const testTodo = {
      text: "Test from script",
      completed: false,
      createdAt: new Date(),
    };

    const result = await db.collection("todos").insertOne(testTodo);
    console.log("✅ Test todo inserted with ID:", result.insertedId);
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);

    // Common error solutions
    if (err.message.includes("SSL")) {
      console.log("💡 Try adding ?ssl=false to your connection string");
    }
    if (err.message.includes("authentication")) {
      console.log("💡 Check your username/password in the connection string");
    }
    if (err.message.includes("network")) {
      console.log("💡 Check MongoDB Atlas Network Access settings");
    }
  } finally {
    await client.close();
    console.log("🔌 Connection closed");
  }
}

run();
