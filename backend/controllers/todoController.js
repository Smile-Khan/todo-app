import Todo from "../models/Todo.js";

// Get all todos for the logged-in user
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Create a new todo
export const createTodo = async (req, res) => {
  const { text, priority, dueDate } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const todo = new Todo({
      user: req.user.id,
      text,
      priority: priority || "Medium",
      dueDate: dueDate || null,
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// Update a todo
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { text, completed, priority, dueDate } = req.body;

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { text, completed, priority, dueDate },
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Todo.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
