require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const dotenv = require("dotenv")

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//DATABASE Connection
async function connectDB() {
  try {
    // mongoose.connect("mongodb://localhost:27017/users");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to mongodb");
  } catch (err) {
    console.error("MongoDB connection failed", err);
  }
}
connectDB();

//User Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String },
  priority: { type: String, enum: ["low", "medium", "high"] },
  dueDate: { type: Date },
});
const Task = mongoose.model("Task", taskSchema);

//Create new Task Method
app.post("/task", async (req, res) => {
  const { title, desc, priority, dueDate } = req.body;

  try {
    const task = new Task({ title, desc, priority, dueDate });
    const saveTask = await task.save();
    res.status(201).json("Successfully saved task", saveTask);
  } catch (err) {
    console.error("Failed to create task", err);
    res.status(500).json({ message: err });
  }
});
//Get all Task Method
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log("Successfully found all tasks");
    res.status(200).json(tasks)
  } catch (err) {
    console.error("Failed to retrieve", err);
    res.status(500).json({ message: err });
  }
});
//

app.get("/", (req, res) => {
  res.send("Hello World, Backend is working!");
});

app.listen(port, (req, res) => {
  console.log(`Backend is running on port: ${port}`);
});
