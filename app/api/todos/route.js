// app/api/todos/route.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("todo-app");
    const todos = await db.collection("todos").find({}).toArray();

    // Transform _id to id for frontend compatibility
    const transformedTodos = todos.map((todo) => ({
      ...todo,
      id: todo._id.toString(),
      _id: undefined,
    }));

    return Response.json(transformedTodos);
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("todo-app");

    // Create todo with default completed status
    const todoData = {
      text: body.text,
      completed: false,
      createdAt: new Date(),
    };

    const result = await db.collection("todos").insertOne(todoData);

    // Return the complete todo object with id
    const newTodo = {
      ...todoData,
      id: result.insertedId.toString(),
    };

    return Response.json(newTodo);
  } catch (error) {
    console.error("POST error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("todo-app");

    const result = await db
      .collection("todos")
      .updateOne(
        { _id: new ObjectId(body.id) },
        { $set: { completed: body.completed } }
      );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("PUT error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("todo-app");

    const result = await db.collection("todos").deleteOne({
      _id: new ObjectId(body.id),
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
