const AggregatedProduct = require("../models/product");
const mongoose = require("mongoose");
const { compressAndUploadImage } = require("../utils/imageProcessor");

// Load environment variables from .env file
require("dotenv").config();

// MongoDB connection setup using environment variable
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const uploadCSV = async (req, res) => {
  const records = req.csvRecords;

  try {
    // Aggregate all products into a single object
    const aggregatedProducts = {};

    // Store details for each serial number
    for (const record of records) {
      const serialNumber = record["Serial Number"];
      const productName = record["Product Name"];
      const inputImageUrls = record["Input Image Urls"]
        .split(",")
        .map((url) => url.trim());

      // Compress images and get output URLs
      const outputImageUrls = await Promise.all(
        inputImageUrls.map(compressAndUploadImage)
      );

      if (!aggregatedProducts[serialNumber]) {
        aggregatedProducts[serialNumber] = {
          serialNumber,
          products: [],
        };
      }

      aggregatedProducts[serialNumber].products.push({
        serialNumber,
        productName,
        inputImageUrls,
        outputImageUrls,
      });
    }

    // Save the aggregated products to MongoDB as a single document
    const product = new AggregatedProduct({
      products: aggregatedProducts,
    });
    const savedProduct = await product.save();

    // Respond with the _id of the saved product
    res.json({ product_id: savedProduct._id });
  } catch (error) {
    console.error("Error saving products to MongoDB:", error);
    res.status(500).json({ error: "Failed to save products to database" });
  }
};

module.exports = { uploadCSV };
