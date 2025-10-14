const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())


async function connectDB() {
    try {
        mongoose.connect('mongodb://localhost:27017/users');
        console.log("Successfully connected to mongodb");
    }catch(err){
        console.error("MongoDB connection failed", err)
    }
}

connectDB();


app.get("/", (req, res) => {
    res.send("Hello World, Backend is working!")
})

//DATABASE Connection


app.listen(port, (req, res) => {
    console.log(`Backend is running on port: ${port}`)
})