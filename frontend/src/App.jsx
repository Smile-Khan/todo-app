import { useEffect, useState } from "react";
import "./index.css";

const API_URL = "http://localhost:5000/api/todos"; // Change this for deployment

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // ✅ Fetch Todos from Backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch todos");
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("❌ Error fetching todos:", error.message);
      }
    };
    fetchTodos();
  }, []);

  // ✅ Add New Todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo }), // No need to send 'completed'
      });

      if (!response.ok) throw new Error("Failed to add todo");

      const data = await response.json();
      setTodos([...todos, data]); // Update UI
      setNewTodo(""); // Clear input
    } catch (error) {
      console.error("❌ Error adding todo:", error.message);
    }
  };

  // ✅ Toggle Todo Completion (No body needed)
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "PUT" });

      if (!response.ok) throw new Error("Failed to update todo");

      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("❌ Error updating todo:", error.message);
    }
  };

  // ✅ Delete Todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete todo");

      setTodos(todos.filter((todo) => todo._id !== id)); // Remove from UI
    } catch (error) {
      console.error("❌ Error deleting todo:", error.message);
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()} // Add on Enter key
        />
        <button className="add-button" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            <input 
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => toggleTodo(todo._id)} 
            />
            <span>{todo.text}</span>
            <button className="delete-button" onClick={() => deleteTodo(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
