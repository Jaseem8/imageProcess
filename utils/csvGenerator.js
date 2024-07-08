const createCSV = (products) => {
  let csvContent = "S. No,Product Name,Input Image Urls,Output Image Urls\n";
  products.forEach((product, index) => {
    csvContent += `${index + 1},${
      product.productName
    },"${product.inputImageUrls.join(", ")}","${product.outputImageUrls.join(
      ", "
    )}"\n`;
  });
  return csvContent;
};

module.exports = { createCSV };
