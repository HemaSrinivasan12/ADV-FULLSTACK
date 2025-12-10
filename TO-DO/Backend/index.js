const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'models', '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/ToDo');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// CREATE - Add new todo
app.post('/todos', async (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title) return res.status(400).send('Title is required');

  const todo = new Todo({
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : undefined
  });

  try {
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error('Create todo error:', err);
    res.status(500).send('Error creating todo');
  }
});

// READ - Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (err) {
    console.error('Get todos error:', err);
    res.status(500).send('Error retrieving todos');
  }
});

// READ - Get single todo
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send('Todo not found');
    res.status(200).json(todo);
  } catch (err) {
    console.error('Get todo error:', err);
    res.status(500).send('Error retrieving todo');
  }
});

// UPDATE - Update todo
app.put('/todos/:id', async (req, res) => {
  const { title, description, completed, dueDate } = req.body;
  try {
    const update = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(completed !== undefined && { completed }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null })
    };

    const todo = await Todo.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!todo) return res.status(404).send('Todo not found');
    res.status(200).json(todo);
  } catch (err) {
    console.error('Update todo error:', err);
    res.status(500).send('Error updating todo');
  }
});

// DELETE - Delete todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).send('Todo not found');
    res.status(200).send('Todo deleted successfully');
  } catch (err) {
    console.error('Delete todo error:', err);
    res.status(500).send('Error deleting todo');
  }
});

// 404 for other routes
app.use((req, res) => res.status(404).send('Not found'));

// MongoDB connection & server start (explicitly loading .env from models folder)
const mongoUri =
  process.env.MONGODB_URL ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGO_URL;

if (!mongoUri) {
  console.error('❌ MongoDB error: no URI found. Looking for:', path.join(__dirname, 'models', '.env'));
  console.error('Current env values: MONGODB_URL=', process.env.MONGODB_URL);
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB error:', err.message || err);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received — closing MongoDB connection');
  try { await mongoose.disconnect(); } catch (e) { /* ignore */ }
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});