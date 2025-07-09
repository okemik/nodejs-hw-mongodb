const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts',
    allowed_formats: ['jpg', 'png'],
  },
});

module.exports = multer({ storage });
