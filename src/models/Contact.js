const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    photo: { type: String },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model("contact", contactSchema);

module.exports = Contact;
