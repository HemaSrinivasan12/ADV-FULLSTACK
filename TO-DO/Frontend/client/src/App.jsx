import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch all todos
  const fetchTodos = () => {
    axios
      .get("http://localhost:3000/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = () => {
    if (!title) return alert("Title is required");

    axios
      .post("http://localhost:3000/todos", { title, description, dueDate })
      .then(() => {
        fetchTodos();
        setTitle("");
        setDescription("");
        setDueDate("");
      })
      .catch((err) => console.error(err));
  };

  // Update todo
  const updateTodo = (id) => {
    axios
      .put(`http://localhost:3000/todos/${id}`, { title, description, dueDate })
      .then(() => {
        fetchTodos();
        setTitle("");
        setDescription("");
        setDueDate("");
        setEditId(null);
      })
      .catch((err) => console.error(err));
  };

  // Delete todo
  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:3000/todos/${id}`)
      .then(() => fetchTodos())
      .catch((err) => console.error(err));
  };

  // Set todo for editing
  const editTodo = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description || "");
    setDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : "");
    setEditId(todo._id);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {editId ? (
          <button onClick={() => updateTodo(editId)}>Update Todo</button>
        ) : (
          <button onClick={addTodo}>Add Todo</button>
        )}
      </div>

      <hr />

      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo._id} className="todo-item">
            <div>
              <h3>{todo.title}</h3>
              {todo.description && <p>{todo.description}</p>}
              {todo.dueDate && <p>Due: {todo.dueDate.slice(0, 10)}</p>}
              <p>Status: {todo.completed ? "Completed" : "Pending"}</p>
            </div>
            <div className="buttons">
              <button onClick={() => editTodo(todo)}>Edit</button>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;