const multer = require("multer");
const { storage } = require("../helpers/cloudinary");

const upload = multer({ storage });

module.exports = upload;
