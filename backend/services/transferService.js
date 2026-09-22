const pool = require('../database/db');

class TransferService {
  async transferPatient(data, adminId) {
    const { patient_id, to_doctor_id, reason } = data;

    // Verify patient exists
    const [patient] = await pool.query(
      'SELECT id, doctor_id FROM patients WHERE id = ?',
      [patient_id]
    );

    if (patient.length === 0) {
      throw { status: 404, message: 'Patient not found.' };
    }

    const fromDoctorId = patient[0].doctor_id;

    if (fromDoctorId === to_doctor_id) {
      throw { status: 400, message: 'Cannot transfer to the same doctor.' };
    }

    // Verify target doctor exists and is a doctor
    const [doctor] = await pool.query(
      `SELECT u.id FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? AND r.name = 'DOCTOR'`,
      [to_doctor_id]
    );

    if (doctor.length === 0) {
      throw { status: 404, message: 'Target doctor not found.' };
    }

    // Begin transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update patient's doctor
      await connection.query(
        'UPDATE patients SET doctor_id = ? WHERE id = ?',
        [to_doctor_id, patient_id]
      );

      // Record transfer history
      await connection.query(
        `INSERT INTO doctor_transfer_history (patient_id, from_doctor_id, to_doctor_id, transferred_by, reason)
         VALUES (?, ?, ?, ?, ?)`,
        [patient_id, fromDoctorId, to_doctor_id, adminId, reason || null]
      );

      await connection.commit();

      return { message: 'Patient transferred successfully.' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getTransferHistory(patientId) {
  let query = `
    SELECT dth.*,
           p.full_name AS patient_name,
           fd.name AS from_doctor_name,
           td.name AS to_doctor_name,
           ab.name AS transferred_by_name
    FROM doctor_transfer_history dth
    JOIN patients p ON dth.patient_id = p.id
    JOIN users fd ON dth.from_doctor_id = fd.id
    JOIN users td ON dth.to_doctor_id = td.id
    JOIN users ab ON dth.transferred_by = ab.id
  `;
  const params = [];

  if (patientId) {
    query += ' WHERE dth.patient_id = ?';
    params.push(patientId);
  }

  query += ' ORDER BY dth.transferred_at DESC';

  const [rows] = await pool.query(query, params);
  return rows;
}
}

module.exports = new TransferService();
