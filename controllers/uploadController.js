const { v4: uuidv4 } = require("uuid");
const { spawnWorker } = require("../utils/workerSpawner");

exports.uploadCSV = async (req, res) => {
  try {
    const uniqueID = uuidv4();
    const { csvRecords } = req; // Assuming csvRecords is set by the validateCSV middleware

    if (!csvRecords) {
      return res.status(400).json({ error: "No CSV data found in request" });
    }

    //const csvData = csvRecords.toString("utf-8"); // Assuming csvRecords is a Buffer

    // You might want to validate csvData here before proceeding to spawnWorker

    res.status(200).json({ uniqueID });

    // Pass the CSV data and uniqueID to the worker
    spawnWorker({ csvRecords, uniqueID });
  } catch (err) {
    console.error("Error processing upload:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
