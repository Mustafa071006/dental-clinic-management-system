const controlScheduleService = require('../services/controlScheduleService');

class ControlScheduleController {
  async createSchedule(req, res) {
    try {
      const { patient_id, control_date } = req.body;

      if (!patient_id || !control_date) {
        return res.status(400).json({ message: 'Patient ID and control date are required.' });
      }

      const schedule = await controlScheduleService.createSchedule(req.body, req.user.id);

      res.status(201).json({
        message: 'Control schedule created successfully.',
        data: schedule,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }
  async getAll(req, res) {
  try {
    const schedules =
      await controlScheduleService.getAll(req.user);

    res.json({
      message:
        'Control schedules retrieved successfully.',
      data: schedules,
    });
  } catch (error) {
    const status = error.status || 500;

    res.status(status).json({
      message:
        error.message ||
        'Internal server error.',
    });
  }
}

  async getByPatient(req, res) {
    try {
      const schedules = await controlScheduleService.getByPatient(
        parseInt(req.params.patientId),
        req.user
      );

      res.json({
        message: 'Control schedules retrieved successfully.',
        data: schedules,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }

  async updateSchedule(req, res) {
    try {
      const result = await controlScheduleService.updateSchedule(
        parseInt(req.params.id),
        req.body,
        req.user
      );

      res.json({
        message: result.message,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }
}

module.exports = new ControlScheduleController();
