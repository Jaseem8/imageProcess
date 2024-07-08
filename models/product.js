const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the product schema
const ProductSchema = new Schema(
  {
    serialNumber: String,
    products: [
      {
        serialNumber: String,
        productName: String,
        inputImageUrls: [String],
        outputImageUrls: [String], // Add outputImageUrls to the schema
      },
    ],
  },
  { _id: false }
);

// Define the main schema to store aggregated products
const AggregatedProductSchema = new Schema(
  {
    products: {
      type: Map,
      of: ProductSchema,
    },
  },
  { timestamps: true }
);

// Create and export the model
const AggregatedProduct = mongoose.model(
  "AggregatedProduct",
  AggregatedProductSchema
);

module.exports = AggregatedProduct;
