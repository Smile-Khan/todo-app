import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TodoApp() {
  const [todo, setTodo] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [filterPriority, setFilterPriority] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTodos(res.data))
      .catch((err) => console.error("Error fetching todos:", err));
  }, [token, navigate]);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleAddTodo = () => {
    if (!todo.trim()) return;

    axios
      .post("http://localhost:5000/api/todos", { text: todo, priority, dueDate }, config)
      .then((res) => {
        setTodos([...todos, res.data]);
        setTodo("");
        setPriority("Medium");
        setDueDate("");
      })
      .catch((err) => console.error("Error adding todo:", err));
  };

  const handleToggleComplete = (id, completed) => {
    axios
      .put(`http://localhost:5000/api/todos/${id}`, { completed: !completed }, config)
      .then((res) => {
        const updatedTodos = todos.map((todo) =>
          todo._id === id ? res.data : todo
        );
        setTodos(updatedTodos);
      })
      .catch((err) => console.error("Error updating todo:", err));
  };

  const handleDeleteTodo = (id) => {
    axios
      .delete(`http://localhost:5000/api/todos/${id}`, config)
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      })
      .catch((err) => console.error("Error deleting todo:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={styles.title}>📝 Todo List (Protected)</h2>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>

        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Enter a task..."
            style={styles.input}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddTodo} style={styles.addButton}>
            Add
          </button>
        </div>

        <div style={styles.filterContainer}>
          <label style={styles.label}>
            Filter by Priority:
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={styles.select}
            >
              <option value="">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>

          <label style={styles.label}>
            Sort by Due Date:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={styles.select}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>

        {todos.length === 0 ? (
          <p style={{ color: "#999" }}>No todos yet</p>
        ) : (
          <ul style={styles.todoList}>
            {todos
              .filter((todo) =>
                filterPriority ? todo.priority === filterPriority : true
              )
              .sort((a, b) => {
                if (!a.dueDate || !b.dueDate) return 0;
                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
              })
              .map((todo) => (
                <li key={todo._id} style={styles.todoItem}>
                  <span
                    onClick={() => handleToggleComplete(todo._id, todo.completed)}
                    style={{
                      ...styles.todoText,
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#999" : "#fff",
                    }}
                  >
                    {todo.text} ({todo.priority}) – {todo.dueDate?.slice(0, 10)}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    style={styles.deleteButton}
                  >
                    ✖
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#2c2c2c",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
  },
  title: {
    color: "#ffffff",
    marginBottom: "1.5rem",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
  },
  inputWrapper: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#444",
    color: "#fff",
    outline: "none",
    minWidth: "140px",
  },
  addButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  todoList: {
    listStyle: "none",
    padding: 0,
    marginTop: "1rem",
  },
  todoItem: {
    backgroundColor: "#3a3a3a",
    padding: "0.75rem 1rem",
    marginBottom: "0.5rem",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background 0.3s",
  },
  todoText: {
    flex: 1,
    fontSize: "1rem",
    cursor: "pointer",
  },
  deleteButton: {
    marginLeft: "1rem",
    backgroundColor: "#e53935",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    gap: "1rem",
  },
  label: {
    color: "#fff",
    fontSize: "0.9rem",
  },
  select: {
    marginLeft: "0.5rem",
    padding: "0.3rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
};

export default TodoApp;
