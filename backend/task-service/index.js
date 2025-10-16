require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const dotenv = require("dotenv")

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


//DATABASE Connection
async function connectDB() {
  try {
    // mongoose.connect("mongodb://localhost:27017/users");
    mongoose.connect(process.env.MONGODB_URI)
    console.log("Successfully connected to mongodb");
  } catch (err) {
    console.error("MongoDB connection failed", err);
  }
}
connectDB();


//User Schema
const taskSchema = new mongoose.Schema({
  name: String,
  desc: String,
});
const Task = mongoose.model("Task", taskSchema);


//Create new Task Method


//Get all Task Method
// 


app.get("/", (req, res) => {
  res.send("Hello World, Backend is working!");
});


app.listen(port, (req, res) => {
  console.log(`Backend is running on port: ${port}`);
});
