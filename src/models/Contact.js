const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  photo: String, // Cloudinary’den gelen fotoğraf URL’si
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
