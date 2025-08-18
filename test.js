import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
console.log("Mongo URI:", uri); // debug

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("todoDB");
    const todos = await db.collection("todos").find({}).toArray();
    console.log("Todos:", todos);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
