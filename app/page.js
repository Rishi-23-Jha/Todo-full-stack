"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Load todos from localStorage on first render
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo = { id: Date.now(), text: input, completed: false };
    setTodos([...todos, newTodo]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-md">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center bg-white shadow p-2 mb-2 rounded"
          >
            <span
              onClick={() => toggleTodo(todo.id)}
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
