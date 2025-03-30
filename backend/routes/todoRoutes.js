const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo"); // Import Todo model

// ✅ GET all todos (Fix: Added this route)
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find(); // Fetch all todos from MongoDB
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ✅ GET a single todo by ID
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// ✅ POST - Add a new todo
router.post("/", async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.text, completed: false });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// ✅ PUT - Update todo text & completion status
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text, completed: req.body.completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// ✅ DELETE - Remove a todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
