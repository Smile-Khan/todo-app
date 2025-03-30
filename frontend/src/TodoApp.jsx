import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/todos"; // Change this for deployment

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // ✅ Fetch Todos from Backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);

  // ✅ Add Todo to Backend
  const addTodo = async () => {
    if (newTodo.trim() === "") return;

    const todoData = { text: newTodo };
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todoData),
    });

    const savedTodo = await response.json();
    setTodos([...todos, savedTodo]); // Update state
    setNewTodo(""); // Clear input
  };

  // ✅ Toggle Completion in Backend
  const toggleTodo = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: "PUT" });
    const updatedTodo = await response.json();

    setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
  };

  // ✅ Delete Todo from Backend
  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    setTodos(todos.filter(todo => todo._id !== id));
  };

  return (
    <div className="todo-container">
      <h2>Todo List</h2>
      
      <input
        type="text"
        className="todo-input"
        placeholder="Add a new task..."
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && addTodo()} // Add on Enter key
      />
      <button className="todo-button" onClick={addTodo}>Add</button>

      {todos.map((todo) => (
        <div key={todo._id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
          <input 
            type="checkbox" 
            checked={todo.completed} 
            onChange={() => toggleTodo(todo._id)} 
          />
          <span>{todo.text}</span>
          <button className="delete-button" onClick={() => deleteTodo(todo._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TodoApp;
