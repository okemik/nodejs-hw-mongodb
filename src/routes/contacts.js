const express = require("express");
const router = express.Router();

// Örnek basit route
router.get("/", (req, res) => {
  res.json({ message: "Contacts route çalışıyor" });
});

module.exports = router;
