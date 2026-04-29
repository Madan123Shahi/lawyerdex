const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { validate } = require('../middleware/validateMiddleware');
const { contactSchema } = require('../validators/lawyerValidators');

router.post('/', validate(contactSchema), submitContact);

module.exports = router;
