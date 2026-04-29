const express = require('express');
const router = express.Router();
const { getLawyers, getLawyer, getFeaturedLawyers, getCategories } = require('../controllers/lawyerController');
const { validateQuery } = require('../middleware/validateMiddleware');
const { lawyerSearchSchema } = require('../validators/lawyerValidators');

router.get('/', validateQuery(lawyerSearchSchema), getLawyers);
router.get('/featured', getFeaturedLawyers);
router.get('/categories', getCategories);
router.get('/:id', getLawyer);

module.exports = router;
