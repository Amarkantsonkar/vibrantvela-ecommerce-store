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

// ✅ Updated CORS: allow localhost + main domain + Vercel preview domains
const allowedOrigins = [
  "http://localhost:5173",
  "https://vibrantvela.vercel.app"
];

// Allow preview deployments like:
// https://vibrantvela-ecommerce-store-o9gh-abcde123.vercel.app
const vercelPreviewRegex = /^https:\/\/vibrantvela-ecommerce-store.*\.vercel\.app$/;

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin || // Allow Postman/curl with no origin
        allowedOrigins.includes(origin) ||
        vercelPreviewRegex.test(origin)
      ) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
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
  console.log(`✅ Server is running on port ${port}`);
});
