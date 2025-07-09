const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const upload = require("../../middlewares/upload");

// Fotoğraf yükleyerek yeni kişi oluşturma
router.post("/", upload.single("photo"), ctrl.createContact);

// Fotoğraf güncelleme
router.patch("/:id", upload.single("photo"), ctrl.updateContact);

module.exports = router;
