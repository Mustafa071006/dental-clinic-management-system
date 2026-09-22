  const pool = require('../database/db');

  class ExaminationService {
    async createExamination(data, doctorId) {
    const {
      patient_id,
      examination_date,
      complaint,
      diagnosis,
      treatment,
      notes
    } = data;

    // Verify patient belongs to doctor
    const [patient] = await pool.query(
      'SELECT id, doctor_id FROM patients WHERE id = ?',
      [patient_id]
    );

    if (patient.length === 0) {
      throw { status: 404, message: 'Patient not found.' };
    }

    if (patient[0].doctor_id !== doctorId) {
      throw {
        status: 403,
        message: 'Access denied. This is not your patient.'
      };
    }

    const [result] = await pool.query(
      `INSERT INTO examinations (
        patient_id,
        doctor_id,
        examination_date,
        complaint,
        diagnosis,
        treatment,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        doctorId,
        examination_date,
        complaint || null,
        diagnosis || null,
        treatment || null,
        notes || null
      ]
    );

    return {
      id: result.insertId,
      patient_id,
      doctor_id: doctorId,
      examination_date,
      complaint,
      diagnosis,
      treatment,
      notes
    };
  }

    async getByPatient(patientId, user) {
      // Verify access
      if (user.role_name === 'DOCTOR') {
        const [patient] = await pool.query(
          'SELECT id, doctor_id FROM patients WHERE id = ?',
          [patientId]
        );

        if (patient.length === 0) {
          throw { status: 404, message: 'Patient not found.' };
        }

        if (patient[0].doctor_id !== user.id) {
          throw { status: 403, message: 'Access denied. This is not your patient.' };
        }
      }

      const [rows] = await pool.query(
        `SELECT e.*, u.name AS doctor_name
        FROM examinations e
        JOIN users u ON e.doctor_id = u.id
        WHERE e.patient_id = ?
        ORDER BY e.examination_date DESC`,
        [patientId]
      );

      return rows;
    }

    async getAll(user) {
  let query = `
    SELECT
      e.*,
      p.full_name AS patient_name,
      u.name AS doctor_name
    FROM examinations e
    JOIN patients p ON e.patient_id = p.id
    JOIN users u ON e.doctor_id = u.id
  `;

  let params = [];

  if (user.role_name === 'DOCTOR') {
    query += `
      WHERE e.doctor_id = ?
    `;
    params.push(user.id);
  }

  query += `
    ORDER BY e.examination_date DESC
  `;

  const [rows] = await pool.query(query, params);

  return rows;
}
  }

  module.exports = new ExaminationService();
