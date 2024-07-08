const csv = require("csv-parse"); // Importing the csv-parse library
const { Writable } = require("stream"); // Importing the Writable stream from the stream module

// Middleware function to validate CSV files
const validateCSV = (req, res, next) => {
  const file = req.file; // Accessing the uploaded file
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" }); // Return an error if no file is uploaded
  }

  const records = []; // Array to store the parsed records
  const parser = csv.parse({
    columns: true, // Parse the CSV with column headers
    trim: true, // Trim whitespace from the parsed values
  });

  // Writable stream to collect parsed records
  const writableStream = new Writable({
    write(chunk, encoding, callback) {
      records.push(chunk); // Push each parsed record to the array
      callback(); // Signal that the write is complete
    },
    objectMode: true, // Enable object mode to handle parsed records as objects
  });

  // On finish, attach the parsed records to the request object and proceed to the next middleware
  writableStream.on("finish", () => {
    req.csvRecords = records; // Attach records to the request object
    next(); // Proceed to the next middleware
  });

  // Handle any parsing errors
  writableStream.on("error", (err) => {
    return res.status(400).json({ error: "Invalid CSV format" }); // Return an error if CSV is invalid
  });

  // Stream the file buffer to the parser and pipe to the writable stream
  parser.write(file.buffer);
  parser.end();
  parser.pipe(writableStream);
};

module.exports = validateCSV; // Export the middleware function
