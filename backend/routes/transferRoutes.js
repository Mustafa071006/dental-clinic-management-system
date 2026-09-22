const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// POST /api/transfers - Transfer patient (Admin only)
router.post('/', authenticate, authorize('ADMIN'), transferController.transferPatient);

// GET /api/transfers - Get transfer history (Admin only)
router.get('/', authenticate, authorize('ADMIN'), transferController.getTransferHistory);

module.exports = router;
