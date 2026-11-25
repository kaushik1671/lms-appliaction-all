const express = require('express');
const router = express.Router();
const { getAdminList, createAdmin, assignSection } = require('../controllers/adminController');

router.get('/list', getAdminList);
router.post('/create', createAdmin);
router.post('/assign-section', assignSection);

module.exports = router;