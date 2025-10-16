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
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model("User", UserSchema);


//User Post Method
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
    console.log(`Successfully saved ${user} in DB`);
  } catch (err) {
    console.error("Failed to save user name and email", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/", (req, res) => {
  res.send("Hello World, Backend is working!");
});


app.listen(port, (req, res) => {
  console.log(`Backend is running on port: ${port}`);
});
