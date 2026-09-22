const express = require('express');
const router = express.Router();
const controlScheduleController = require('../controllers/controlScheduleController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// POST /api/control-schedules - Create schedule (Doctor only)
router.post('/', authenticate, authorize('DOCTOR'), controlScheduleController.createSchedule);

// GET /api/control-schedules - Get all schedules (Admin and Doctor)
router.get('/', authenticate, authorize('ADMIN', 'DOCTOR'), controlScheduleController.getAll);

// GET /api/control-schedules/patient/:patientId - Get schedules by patient
router.get('/patient/:patientId', authenticate, authorize('ADMIN', 'DOCTOR'), controlScheduleController.getByPatient);

// PUT /api/control-schedules/:id - Update schedule (Doctor only)
router.put('/:id', authenticate, authorize('DOCTOR'), controlScheduleController.updateSchedule);

module.exports = router;
