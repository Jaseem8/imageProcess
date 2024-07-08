// routes/status.js

const express = require("express");
const { checkStatus } = require("../controllers/statusController");

const router = express.Router();

router.get("/:uniqueID", checkStatus); // Define GET route for checking status

module.exports = router;
