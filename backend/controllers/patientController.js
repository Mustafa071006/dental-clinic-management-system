const patientService = require('../services/patientService');

class PatientController {
  async getAllPatients(req, res) {
    try {
      const patients = await patientService.getAllPatients(req.user);
      res.json({
        message: 'Patients retrieved successfully.',
        data: patients,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }

  async getPatientById(req, res) {
    try {
      const patient = await patientService.getPatientById(parseInt(req.params.id), req.user);
      res.json({
        message: 'Patient retrieved successfully.',
        data: patient,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }

  async createPatient(req, res) {
  try {

    console.log("========== CREATE PATIENT ==========");
    console.log("USER LOGIN:", req.user);
    console.log("BODY:", req.body);

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Patient name is required.'
      });
    }

    const patient = await patientService.createPatient(
      req.body,
      req.user
    );

    res.status(201).json({
      message: 'Patient created successfully.',
      data: patient,
    });

  } catch (error) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error.';
    res.status(status).json({ message });
  }
}

  async updatePatient(req, res) {
    try {
      const result = await patientService.updatePatient(parseInt(req.params.id), req.body, req.user);
      res.json({
        message: result.message,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }

  async updatePatientStatus(req, res) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
      }

      const result = await patientService.updatePatientStatus(parseInt(req.params.id), status, req.user);
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

module.exports = new PatientController();
