const express = require('express');
const router = express.Router();
const { getResources, getResource, getLatestResources } = require('../controllers/resourceController');

router.get('/', getResources);
router.get('/latest', getLatestResources);
router.get('/:slug', getResource);

module.exports = router;
