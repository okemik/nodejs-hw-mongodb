const contactsService = require("../services/contacts");
const createError = require("http-errors");

const getAllContacts = async (req, res) => {
  const result = await contactsService.getAll(req.query);

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: result,
  });
};

const createContact = async (req, res) => {
  const contact = await contactsService.createContact(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

const getContactById = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.contactId);
  if (!contact) {
    throw createError(404, "Contact not found");
  }
  res.status(200).json({
    status: 200,
    data: contact,
  });
};

const updateContact = async (req, res) => {
  const contact = await contactsService.updateContact(req.params.contactId, req.body);
  if (!contact) {
    throw createError(404, "Contact not found");
  }
  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: contact,
  });
};

const deleteContact = async (req, res) => {
  const result = await contactsService.deleteContact(req.params.contactId);
  if (!result) {
    throw createError(404, "Contact not found");
  }
  res.status(204).send();
};

module.exports = {
  getAllContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
