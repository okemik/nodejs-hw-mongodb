const Contact = require('../models/Contact');
const createError = require('http-errors');

exports.createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      userId: req.user._id,
      photo: req.file?.path || '',
    });
    res.status(201).json({ status: 'success', data: contact });
  } catch (err) {
    next(err);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (req.file?.path) update.photo = req.file.path;

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, userId: req.user._id },
      update,
      { new: true }
    );

    if (!contact) throw createError(404, 'Contact not found!');
    res.status(200).json({ status: 'success', data: contact });
  } catch (err) {
    next(err);
  }
};
