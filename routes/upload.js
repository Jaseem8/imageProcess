const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for uploaded files
const { uploadCSV } = require("../controllers/uploadController");
const validateCSV = require("../middlewares/csvValidator");

const router = express.Router();

router.post("/", upload.single("file"), validateCSV, uploadCSV); // Define POST route for uploading CSV files

module.exports = router; // Export the router
