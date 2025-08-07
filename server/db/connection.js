const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    if (connection.STATES.connecting) {
      console.log(`Connecting to the database...`);
    }
    if (connection.STATES.connected) {
      console.log(`Database connected successfully: `);
    }
    if (connection.STATES.disconnected) {
      console.log(`Database disconnected.`);
    }
  } catch (error) {
    console.log("Database connection failed:", error);
  }
};

module.exports = { connectDB };
