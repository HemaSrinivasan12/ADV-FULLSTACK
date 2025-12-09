require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const foodmodel = require('./models/Food');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/insert", async (req, res) => {
    const foodName = req.body.foodName;
    const daySinceIate = req.body.daySinceIate;
    const food = new foodmodel({ foodName: foodName, daySinceIate: daySinceIate });
    try {
        await food.save();
        res.status(201).send("Data Inserted successfully");
    } catch (err) {
        res.status(500).send("Error inserting food item");
    }
});

app.get("/read", async (req, res) => {
    try {
        const foodItems = await foodmodel.find({});
        res.status(200).json(foodItems);
    } catch (err) {
        res.status(500).send("Error retrieving food items");
    }
});

app.put("/update/:id", async (req, res) => {
    const newFoodName = req.body.newFoodName;
    const id = req.params.id;
    try {
        await foodmodel.findByIdAndUpdate(id, { foodName: newFoodName });
        res.status(200).send("Food Item Updated");
    } catch (err) {
        res.status(500).send("Error updating food item");
    }
});

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await foodmodel.findByIdAndDelete(id);
        res.status(200).send("Food Item Deleted successfully");
    } catch (err) {
        res.status(500).send("Error deleting food item");
    }
});

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});