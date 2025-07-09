const Contact = require("../models/Contact");

const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const photo = req.file?.path || null;

  const newContact = await Contact.create({ name, email, phone, photo });

  res.status(201).json({
    status: 201,
    message: "Contact created",
    data: newContact,
  });
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const photo = req.file?.path;

  const update = { name, email, phone };
  if (photo) update.photo = photo;

  const contact = await Contact.findByIdAndUpdate(id, update, { new: true });

  if (!contact) {
    return res.status(404).json({ status: 404, message: "Contact not found" });
  }

  res.status(200).json({
    status: 200,
    message: "Contact updated",
    data: contact,
  });
};

module.exports = {
  createContact,
  updateContact,
};
