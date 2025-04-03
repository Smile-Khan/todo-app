const express = require("express");
const Todo = require("../models/Todo"); // Import Todo model
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ GET all todos for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.userId }); // Fetch only user's todos
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ✅ GET a single todo by ID (only if it belongs to the user)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.userId });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// ✅ POST - Add a new todo (linked to user)
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Received Data:", req.body); // ✅ Log incoming data

    if (!req.body.text) {
      console.log("❌ Error: Text field is missing in request body");
      return res.status(400).json({ error: "Text is required" });
    }

    const newTodo = new Todo({ 
      text: req.body.text, 
      completed: false, 
      priority: req.body.priority || "Low", 
      dueDate: req.body.dueDate, 
      user: req.user.userId  
    });

    const savedTodo = await newTodo.save();
    console.log("✅ New Todo Created:", savedTodo); // ✅ Log saved todo

    res.json(savedTodo);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Failed to add todo" });
  }
});


// ✅ PUT - Update todo (only if it belongs to the user)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { text: req.body.text, completed: req.body.completed, priority: req.body.priority, dueDate: req.body.dueDate },
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

// ✅ DELETE - Remove a todo (only if it belongs to the user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
