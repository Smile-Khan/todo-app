 
const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo"); // Import Todo model

// ✅ GET all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find(); // Fetch todos from MongoDB
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
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

// ✅ PUT - Toggle todo completed state
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
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
