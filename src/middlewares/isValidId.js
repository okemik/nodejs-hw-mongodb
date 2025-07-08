const { isValidObjectId } = require("mongoose");
const { BadRequest } = require("http-errors");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(BadRequest(`${contactId} is not a valid id`));
  }
  next();
};

module.exports = isValidId;
