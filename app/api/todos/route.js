// app/api/todos/route.js
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("todo-app"); // ✅ match your DB name in URI
    const todos = await db.collection("todos").find({}).toArray();

    return Response.json(todos);
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("todo-app"); // ✅ same DB as above
    const result = await db.collection("todos").insertOne(body);

    return Response.json(result);
  } catch (error) {
    console.error("POST error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
