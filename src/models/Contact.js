const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  photo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
