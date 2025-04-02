const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // 👈 Link to User
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
