const transferService = require('../services/transferService');

class TransferController {
  async transferPatient(req, res) {
    try {
      const { patient_id, to_doctor_id } = req.body;

      if (!patient_id || !to_doctor_id) {
        return res.status(400).json({ message: 'Patient ID and target doctor ID are required.' });
      }

      const result = await transferService.transferPatient(req.body, req.user.id);

      res.json({
        message: result.message,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }

  async getTransferHistory(req, res) {
    try {
      const patientId = req.query.patient_id ? parseInt(req.query.patient_id) : null;
      const history = await transferService.getTransferHistory(patientId);

      res.json({
        message: 'Transfer history retrieved successfully.',
        data: history,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }
}

module.exports = new TransferController();
