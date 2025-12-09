require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/ToDo');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// CREATE - Add new todo
app.post("/todos", async (req, res) => {
    const { title, description, dueDate } = req.body;
    
    if (!title) {
        return res.status(400).send("Title is required");
    }
    
    const todo = new Todo({ title, description, dueDate });
    try {
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).send("Error creating todo");
    }
});

// READ - Get all todos
app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find({}).sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).send("Error retrieving todos");
    }
});

// READ - Get single todo
app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).send("Error retrieving todo");
    }
});

// UPDATE - Update todo
app.put("/todos/:id", async (req, res) => {
    const { title, description, completed, dueDate } = req.body;
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description, completed, dueDate },
            { new: true }
        );
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).send("Error updating todo");
    }
});

// DELETE - Delete todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.status(200).send("Todo deleted successfully");
    } catch (err) {
        res.status(500).send("Error deleting todo");
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.error('❌ MongoDB error:', err.message);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});