const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch(err => console.error('❌ MongoDB Connection Failed:', err));

// ✅ Todo Schema & Model
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// ✅ Get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos' });
    }
});

// ✅ Get a single todo by ID (Moved this above PUT & DELETE)
app.get('/api/todos/:id', async (req, res) => {
    try {
        console.log(`Fetching todo with ID: ${req.params.id}`);

        // Check if ID is valid before querying MongoDB
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Todo ID' });
        }

        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        res.json(todo);
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ message: 'Error fetching todo' });
    }
});

// ✅ Create a new todo
app.post('/api/todos', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Text is required' });

        const newTodo = new Todo({ text });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo' });
    }
});

// ✅ Update a todo (toggle complete)
app.put('/api/todos/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Todo ID' });
        }

        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        todo.completed = !todo.completed;
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo' });
    }
});

// ✅ Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Todo ID' });
        }

        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo' });
    }
});
// ✅ Default route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Todo API! Use /api/todos to interact with the backend.');
});
// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
