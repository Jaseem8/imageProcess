const { createCSV } = require("../utils/csvGenerator");
const AggregatedProduct = require("../models/product");

const downloadCSV = async (req, res) => {
  const { uniqueID } = req.params;
  console.log("Entered downloadCSV endpoint");

  try {
    // Fetch data from MongoDB based on uniqueID
    console.log(`Looking for product with uniqueID: ${uniqueID}`);
    const aggregatedProduct = await AggregatedProduct.findOne({ uniqueID });

    if (!aggregatedProduct) {
      console.log("No data found for given uniqueID");
      return res
        .status(404)
        .json({ error: "Data not found, please try again" });
    }
    if (aggregatedProduct.status != "completed") {
      console.log("Please wait some more Time.Your File Is under Process");
      return res.status(404).json({ error: "File Is Under Processing" });
    }
    // Extract all products from the nested structure
    const allProducts = [];

    const productList = aggregatedProduct.products;
    // console.log("productList", productList);

    if (Array.isArray(productList)) {
      allProducts.push(...productList);
    } else {
      console.error(`Unexpected structure for products at key: `);
    }

    //console.log("All Products:", JSON.stringify(allProducts, null, 2));

    // Generate CSV data based on allProducts
    console.log("Generating CSV data");
    const csvData = createCSV(allProducts);

    // Set headers for CSV download
    console.log("Setting headers for CSV download");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${uniqueID}.csv`
    );

    // Send CSV data as response
    console.log("Sending CSV data");
    res.status(200).send(csvData);
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { downloadCSV };
