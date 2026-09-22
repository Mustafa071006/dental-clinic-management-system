const pool = require('../database/db');

class ControlScheduleService {
  async createSchedule(data, doctorId) {
    const { patient_id, control_date, control_time, notes } = data;

    // Validate control date (cannot be in the past)
const today = new Date();
today.setHours(0, 0, 0, 0);

const selectedDate = new Date(control_date);
selectedDate.setHours(0, 0, 0, 0);

if (selectedDate < today) {
  throw {
    status: 400,
    message: 'Control date cannot be earlier than today.',
  };
}

    // Verify patient belongs to doctor
    const [patient] = await pool.query(
      'SELECT id, doctor_id FROM patients WHERE id = ?',
      [patient_id]
    );

    if (patient.length === 0) {
      throw { status: 404, message: 'Patient not found.' };
    }

    if (patient[0].doctor_id !== doctorId) {
      throw { status: 403, message: 'Access denied. This is not your patient.' };
    }

    const [result] = await pool.query(
      `INSERT INTO control_schedules (patient_id, doctor_id, control_date, control_time, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [patient_id, doctorId, control_date, control_time || null, notes || null]
    );

    return {
  id: result.insertId,
  patient_id,
  doctor_id: doctorId,
  control_date,
  control_time,
  notes,
  status: 'PENDING',
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
      `SELECT cs.*, u.name AS doctor_name
       FROM control_schedules cs
       JOIN users u ON cs.doctor_id = u.id
       WHERE cs.patient_id = ?
       ORDER BY cs.control_date DESC, cs.control_time DESC`,
      [patientId]
    );

    return rows;
  }

  async updateSchedule(scheduleId, data, user) {
  const [rows] = await pool.query(
    'SELECT * FROM control_schedules WHERE id = ?',
    [scheduleId]
  );

  if (rows.length === 0) {
    throw { status: 404, message: 'Schedule not found.' };
  }

  const schedule = rows[0];

  if (user.role_name === 'DOCTOR' && schedule.doctor_id !== user.id) {
    throw { status: 403, message: 'Access denied. This is not your schedule.' };
  }

  const { control_date, control_time, notes, status } = data;

  if (status) {
    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      throw {
        status: 400,
        message: 'Invalid status. Must be PENDING, COMPLETED, or CANCELLED.',
      };
    }
  }

  await pool.query(
    `UPDATE control_schedules
     SET control_date = COALESCE(?, control_date),
         control_time = COALESCE(?, control_time),
         notes = COALESCE(?, notes),
         status = COALESCE(?, status)
     WHERE id = ?`,
    [
      control_date || null,
      control_time || null,
      notes || null,
      status || null,
      scheduleId,
    ]
  );

  return { message: 'Schedule updated successfully.' };
}
async getAll(user) {
  let query = `
    SELECT
      cs.*,
      p.full_name AS patient_name,
      u.name AS doctor_name
    FROM control_schedules cs
    JOIN patients p ON cs.patient_id = p.id
    JOIN users u ON cs.doctor_id = u.id
  `;

  let params = [];

  if (user.role_name === 'DOCTOR') {
    query += ` WHERE cs.doctor_id = ?`;
    params.push(user.id);
  }

  query += `
    ORDER BY cs.control_date ASC,
             cs.control_time ASC
  `;

  const [rows] = await pool.query(query, params);

  return rows;
}
}

module.exports = new ControlScheduleService();
