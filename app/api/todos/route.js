import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET all todos
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("todoapp");
    const todos = await db.collection("todos").find({}).toArray();
    return NextResponse.json(todos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST a new todo
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("todoapp");
    const data = await req.json();
    const newTodo = {
      text: data.text || "",
      completed: false,
      createdAt: new Date(),
    };
    const result = await db.collection("todos").insertOne(newTodo);
    return NextResponse.json({ ...newTodo, _id: result.insertedId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}

// PUT (update) a todo
export async function PUT(req) {
  try {
    const client = await clientPromise;
    const db = client.db("todoapp");
    const data = await req.json();
    const { _id, text, completed } = data;

    const { ObjectId } = await import("mongodb");
    const result = await db
      .collection("todos")
      .updateOne({ _id: new ObjectId(_id) }, { $set: { text, completed } });

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}
