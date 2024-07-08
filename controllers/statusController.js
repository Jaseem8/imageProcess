// controllers/statusController.js

const AggregatedProduct = require("../models/product"); // Adjust the path as needed

exports.checkStatus = async (req, res) => {
  try {
    const { uniqueID } = req.params;
    const product = await AggregatedProduct.findOne({ uniqueID });

    if (!product) {
      return res.status(404).json({ error: "Request ID not found" }, uniqueID);
    }

    res.status(200).json({
      uniqueID: product.uniqueID,
      status: product.status,
      error: product.error || null,
    });
  } catch (err) {
    console.error("Error checking status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
