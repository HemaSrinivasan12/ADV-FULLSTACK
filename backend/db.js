const mongoose = require('mongoose');

const uri = 'mongodb+srv://root:root@cluster1.uz5q0dp.mongodb.net/test'

mongoose.connect(uri)
const connection = mongoose.connection
connection.once('open', ()=>{
    console.log("Mongo db database connection establish")
})