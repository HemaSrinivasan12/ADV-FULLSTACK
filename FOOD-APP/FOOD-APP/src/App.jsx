import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [foodName, setFoodName] = useState("");
  const [daySinceIate, setDaySinceIate] = useState("");
  const [newFoodName, setNewFoodName] = useState("");
  const [foods, setFoods] = useState([]);

  // Fetch all food items
  useEffect(() => {
    axios
      .get("http://localhost:3000/read")
      .then((response) => setFoods(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Add new food
  const addToList = () => {
    axios
      .post("http://localhost:3000/insert", {
        foodName: foodName,
        daySinceIate: Number(daySinceIate),
      })
      .then(() => {
        axios.get("http://localhost:3000/read").then((res) => setFoods(res.data));
        setFoodName("");
        setDaySinceIate("");
      })
      .catch((err) => console.error(err));
  };

  // Update food name
  const updateFood = (id) => {
    axios
      .put(`http://localhost:3000/update/${id}`, { newFoodName })
      .then(() => {
        axios.get("http://localhost:3000/read").then((res) => setFoods(res.data));
        setNewFoodName("");
      })
      .catch((err) => console.error(err));
  };

  // Delete food
  const deleteFood = (id) => {
    axios
      .delete(`http://localhost:3000/delete/${id}`)
      .then(() => setFoods(foods.filter((food) => food._id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="App">
      <h1>Food List</h1>

      <label>Food Name:</label>
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
      />

      <label>Days Since Eaten:</label>
      <input
        type="number"
        value={daySinceIate}
        onChange={(e) => setDaySinceIate(e.target.value)}
      />

      <button onClick={addToList}>Add to List</button>

      <hr />

      {foods.map((food) => (
        <div key={food._id} className="foodItem">
          <h3>{food.foodName}</h3>
          <p>Days since eaten: {food.daySinceIate}</p>

          <input
            type="text"
            placeholder="New Food Name..."
            value={newFoodName}
            onChange={(e) => setNewFoodName(e.target.value)}
          />

          <button onClick={() => updateFood(food._id)}>Update</button>
          <button onClick={() => deleteFood(food._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
