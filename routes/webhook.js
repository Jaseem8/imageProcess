// routes/webhook.js

const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("Webhook received:", req.body);
  // Handle webhook payload here
  res.status(200).send("Webhook received successfully");
});

module.exports = router;
