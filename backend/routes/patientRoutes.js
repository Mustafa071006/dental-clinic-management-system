const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// GET /api/patients - List patients (Admin: all, Doctor: own only)
router.get('/', authenticate, authorize('ADMIN', 'DOCTOR'), patientController.getAllPatients);

// GET /api/patients/:id - Get patient by ID
router.get('/:id', authenticate, authorize('ADMIN', 'DOCTOR'), patientController.getPatientById);

// POST /api/patients - Create patient (Admin & Doctor)
router.post('/', authenticate, authorize('ADMIN', 'DOCTOR'), patientController.createPatient);

// PUT /api/patients/:id - Update patient (Doctor only, own patient)
router.put('/:id', authenticate, authorize('DOCTOR'), patientController.updatePatient);

// PUT /api/patients/:id/status - Update patient status (Doctor only, own patient)
router.put('/:id/status', authenticate, authorize('DOCTOR'), patientController.updatePatientStatus);

module.exports = router;