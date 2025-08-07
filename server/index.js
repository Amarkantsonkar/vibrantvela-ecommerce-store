// Import express
const express = require("express");
const dotenv = require("dotenv");

// Initialize express app
const app = express();
dotenv.config();

// Port setup
const port = process.env.PORT || 3001;
const cors = require("cors");
const { readdirSync } = require("fs");
const { connectDB } = require("./db/connection");

// handlling connection errors
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

connectDB();

// get, put, post, delete
app.get("/", (req, res) => {
  res.send(`<center><h1>Welcome to the Express Server on: ${port}</h1></center>`);
});

// Dynamically load routes from the routes directory
readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

// Start listening on port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
