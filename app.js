const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Router = require("./routers");
dotenv.config({ path: "./config.env" });
const app = express();

const dbURI = process.env.DATABASE;
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:3000',
  credentials: true
}));

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(Router);
// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Connect to MongoDB
mongoose
  .connect(dbURI, mongooseOptions)
  .then(() => {
    app.listen(port);
    console.log(`Connected to MongoDB and listening at port ${port}`);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Please check your DATABASE environment variable and ensure MongoDB is running.');
    // Don't exit the process, as Railway will restart it automatically
  });

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", function (_, res) {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
