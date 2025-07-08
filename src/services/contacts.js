const Contact = require("../models/Contact");

const createContact = (data) => Contact.create(data);

const getAll = async (query) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    isFavourite,
    contactType,
  } = query;

  const skip = (page - 1) * perPage;
  const limit = Number(perPage);

  const filter = {};
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === "true";
  }
  if (contactType) {
    filter.contactType = contactType;
  }

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(limit);

  return {
    data: contacts,
    page: Number(page),
    perPage: limit,
    totalItems,
    totalPages,
    hasPreviousPage: Number(page) > 1,
    hasNextPage: Number(page) < totalPages,
  };
};

const getContactById = (id) => Contact.findById(id);

const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

const deleteContact = (id) => Contact.findByIdAndDelete(id);

module.exports = {
  createContact,
  getAll, // ✅ Artık gelişmiş versiyon
  getContactById,
  updateContact,
  deleteContact,
};
