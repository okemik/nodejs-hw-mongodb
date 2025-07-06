const Contact = require("../models/Contact");

const createContact = (data) => Contact.create(data);

const getContactById = (id) => Contact.findById(id);

const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

const deleteContact = (id) => Contact.findByIdAndDelete(id);

module.exports = {
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
