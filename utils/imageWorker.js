// utils/imageWorker.js

const { parentPort, workerData } = require("worker_threads");
const { compressAndUploadImage } = require("./imageProcessor");
const mongoose = require("mongoose");
const AggregatedProduct = require("../models/product"); // Adjust the path as needed
require("dotenv").config();
const axios = require("axios");

// Retrieve webhook URL from environment variables
const webhookUrl = process.env.WEBHOOK_URL;

const notifyWebhook = async (uniqueID) => {
  try {
    const response = await axios.post(webhookUrl, { uniqueID });
    console.log("Webhook response:", response.data);
  } catch (error) {
    console.error("Error sending webhook:", error.message);
  }
};

(async () => {
  try {
    const { csvRecords, uniqueID } = workerData;
    const mongoURI = process.env.MONGODB_URI;

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {});

    // Initially, add an entry to the database with the uniqueID and default status
    await AggregatedProduct.create({
      uniqueID,
      products: [],
      status: "processing",
    });

    // Aggregate all products into a single object
    const aggregatedProducts = [];
    //console.log(csvRecords);
    // Store details for each serial number
    for (const record of csvRecords) {
      const serialNumber = record["Serial Number"];
      const productName = record["Product Name"];
      const inputImageUrls = record["Input Image Urls"]
        .split(",")
        .map((url) => url.trim());

      // Compress images and get output URLs
      const outputImageUrls = await Promise.all(
        inputImageUrls.map(compressAndUploadImage)
      );

      aggregatedProducts.push({
        serialNumber,
        productName,
        inputImageUrls,
        outputImageUrls,
      });
    }

    // Update the entry with the processed products and set the status to "completed"
    await AggregatedProduct.updateOne(
      { uniqueID },
      {
        $set: {
          products: aggregatedProducts,
          status: "completed",
        },
      }
    );

    // After processing is complete, send a webhook notification
    await notifyWebhook(workerData.uniqueID);

    // Notify completion
    parentPort.postMessage({ status: "completed", uniqueID });

    // Close the MongoDB connection
    await mongoose.connection.close();
  } catch (error) {
    parentPort.postMessage({ status: "error", error: error.message });

    // Update the status to "error" in case of failure
    await AggregatedProduct.updateOne(
      { uniqueID },
      {
        $set: {
          status: "error",
          error: error.message,
        },
      }
    );

    // Close the MongoDB connection in case of an error
    await mongoose.connection.close();
  }
})();
