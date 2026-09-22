const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// GET /api/users - List all doctors (Admin only)
router.get('/', authenticate, authorize('ADMIN'), userController.getAllDoctors);

// POST /api/users - Create doctor (Admin only)
router.post('/', authenticate, authorize('ADMIN'), userController.createDoctor);

// PUT /api/users/:id - Update doctor profile (Admin only)
router.put('/:id', authenticate, authorize('ADMIN'), userController.updateDoctor);

// PUT /api/users/:id/reset-password - Reset doctor password (Admin only)
router.put('/:id/reset-password', authenticate, authorize('ADMIN'), userController.resetPassword);

// PUT /api/users/change-password - Change own password (Doctor only)
router.put('/change-password', authenticate, authorize('DOCTOR'), userController.changePassword);

// PATCH /api/users/:id/status - Toggle ACTIVE/INACTIVE
router.patch('/:id/status', authenticate, authorize('ADMIN'), userController.toggleDoctorStatus);

// DELETE /api/users/:id - Delete doctor (Admin only)
router.delete('/:id',authenticate,authorize('ADMIN'),userController.deleteDoctor);

module.exports = router;
