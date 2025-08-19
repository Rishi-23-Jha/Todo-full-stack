let todos = []; // temporary in-memory storage (will reset on server restart)

// GET all todos
export async function GET() {
  return new Response(JSON.stringify(todos), { status: 200 });
}

// POST - create a new todo
export async function POST(req) {
  const body = await req.json();
  const newTodo = { id: Date.now(), text: body.text, completed: false };
  todos.push(newTodo);
  return new Response(JSON.stringify(newTodo), { status: 201 });
}

// PUT - update a todo
export async function PUT(req) {
  const body = await req.json();
  todos = todos.map((todo) =>
    todo.id === body.id ? { ...todo, ...body } : todo
  );
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

// DELETE - remove a todo
export async function DELETE(req) {
  const body = await req.json();
  todos = todos.filter((todo) => todo.id !== body.id);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
