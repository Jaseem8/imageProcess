require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const uploadRouter = require("./routes/upload");
const statusRouter = require("./routes/status");
const webHookRouter = require("./routes/webhook");
const { downloadCSV } = require("./controllers/downloadController");
const app = express();
const PORT = process.env.PORT || 3000; // Set the port number

// Ensure MongoDB URI is set
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("Error: MONGODB_URI is not set in the environment variables");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");

  // Define routes only after MongoDB connection is established
  app.use(express.json());

  app.use("/upload", uploadRouter); // Use the upload router for /upload path
  app.use("/status", statusRouter); // Use the status router for /status path
  app.use("/process-completed", webHookRouter); // Use the status router for /status path
  app.get("/download-csv/:uniqueID", downloadCSV); // Route to download output CSV

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Start the server
  });
});

mongoose.connection.on("error", (err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
  process.exit(1);
});
