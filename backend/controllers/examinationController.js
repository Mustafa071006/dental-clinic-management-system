const examinationService = require('../services/examinationService');

class ExaminationController {
  async createExamination(req, res) {
    try {
      const { patient_id, examination_date } = req.body;

      if (!patient_id || !examination_date) {
        return res.status(400).json({ message: 'Patient ID and examination date are required.' });
      }

      const examination = await examinationService.createExamination(req.body, req.user.id);

      res.status(201).json({
        message: 'Examination created successfully.',
        data: examination,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }

  async getAll(req, res) {
  try {
    const examinations =
      await examinationService.getAll(req.user);

    res.json({
      message: 'Examinations retrieved successfully.',
      data: examinations,
    });
  } catch (error) {
    const status = error.status || 500;

    res.status(status).json({
      message:
        error.message || 'Internal server error.',
    });
  }
}

  async getByPatient(req, res) {
    try {
      const examinations = await examinationService.getByPatient(
        parseInt(req.params.patientId),
        req.user
      );

      res.json({
        message: 'Examinations retrieved successfully.',
        data: examinations,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }
}

module.exports = new ExaminationController();
