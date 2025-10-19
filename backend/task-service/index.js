require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const amqp = require("amqplib");
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
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Task = mongoose.model("Task", taskSchema);

//Connecting to rabbitMQ
let channel, connection;

async function connectRabbitMQWithRetry(retries = 5, delay = 1000) {
  while (retries > 0) {
    try {
      connection = await amqp.connect("amqp://rabbitmq");
      channel = await connection.createChannel();
      await channel.assertQueue("Task_Created");
      console.log("Connected to RabbitMQ", { durable: true });
      return channel;
    } catch (err) {
      console.error("RabbitMQ connection failed:", err);
      retries--;
      console.error("RabbitMQ retrying again:", err);
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }
  throw new Error("Could not connect to RabbitMQ after multiple attempts. ");
}

//Create new Task Method
app.post("/task", async (req, res) => {
  const { title, desc, priority, dueDate, userId } = req.body;

  try {
    const task = new Task({ title, desc, priority, dueDate, userId });
    const saveTask = await task.save();
    const message = { taskId: task._id, userId, title };

    if (!channel) {
      return res.status(503).json();
    }

    channel.sendToQueue(
      "Task_Created",
      Buffer.from(JSON.stringify(message))
    );
    res.status(201).json({message: "Successfully saved task", task: saveTask});
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
    res.status(200).json(tasks);
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
  connectRabbitMQWithRetry();
});
