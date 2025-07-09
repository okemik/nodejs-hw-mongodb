const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');
const controller = require('../controllers/contacts');

router.use(authenticate);
router.post('/', upload.single('photo'), controller.createContact);
router.patch('/:contactId', upload.single('photo'), controller.updateContact);

module.exports = router;
