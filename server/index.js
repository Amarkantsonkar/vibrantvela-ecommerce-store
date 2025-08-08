// Import express
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { readdirSync } = require("fs");
const { connectDB } = require("./db/connection");

// Initialize express app
const app = express();
dotenv.config();

// Port setup
const port = process.env.PORT || 3001;

// ✅ Updated CORS: allow local + deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://vibrantvela.vercel.app", // ← add this
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Connect to database
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send(`<center><h1>Welcome to the Express Server on: ${port}</h1></center>`);
});

// Dynamically load routes from the routes directory
readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
