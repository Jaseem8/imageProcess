const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the product schema
const ProductSchema = new Schema(
  {
    serialNumber: { type: String, required: true },
    productName: { type: String, required: true },
    inputImageUrls: { type: [String], required: true },
    outputImageUrls: {
      type: [String],
      required: true,
      default: ["not-processed"],
    },
  },

  { _id: false }
);

// Define the main schema to store aggregated products
const AggregatedProductSchema = new Schema(
  {
    uniqueID: { type: String, required: true },
    status: { type: String, required: true, default: "not-processed" },
    products: {
      type: Array,
      of: ProductSchema,
      required: true,
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
