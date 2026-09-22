const express = require('express');
const router = express.Router();
const examinationController = require('../controllers/examinationController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// POST /api/examinations - Create examination (Doctor only)
router.post('/', authenticate, authorize('DOCTOR'), examinationController.createExamination);

// GET /api/examinations - Get all examinations (Admin and Doctor)
router.get('/', authenticate, authorize('ADMIN', 'DOCTOR'), examinationController.getAll);

// GET /api/examinations/patient/:patientId - Get examinations by patient
router.get('/patient/:patientId', authenticate, authorize('ADMIN', 'DOCTOR'), examinationController.getByPatient);

module.exports = router;
