const express = require("express");
const uploadRouter = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3000; // Set the port number

app.use("/upload", uploadRouter); // Use the upload router for /upload path

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Start the server
});
