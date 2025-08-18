import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("todo_db");

    const result = await db
      .collection("todos")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { completed: body.completed } }
      );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
