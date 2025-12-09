const express = require("express")
const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome you all to this page');
});

app.get('/users', (req, res) => {
    res.send("hello user");
});

app.get('/users/:userID', (req, res) => {
    const userID = req.params.userID;
    res.send(`user ID is : ${userID}`);
});

// FIXED ROUTE
app.get('/users/:userID/profile', (req, res) => {
    const userID = req.params.userID;
    const name = req.query.name;
    const age = req.query.age;

    res.send(`Profile of USER ID: ${userID}, Name: ${name}, Age: ${age}`);
});

app.listen(port, () => {
    console.log("listening at 3000");
});
