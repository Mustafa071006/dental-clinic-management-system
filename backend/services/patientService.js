const pool = require("../database/db");

class PatientService {
  async getAllPatients(user) {
    let query = `
      SELECT p.*, u.name AS doctor_name
      FROM patients p
      JOIN users u ON p.doctor_id = u.id
    `;
    const params = [];

    // Doctor can only see their own patients
    if (user.role_name === "DOCTOR") {
      query += " WHERE p.doctor_id = ?";
      params.push(user.id);
    }

    query += " ORDER BY p.created_at DESC";

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getPatientById(patientId, user) {
    const [rows] = await pool.query(
      `SELECT p.*, u.name AS doctor_name
       FROM patients p
       JOIN users u ON p.doctor_id = u.id
       WHERE p.id = ?`,
      [patientId]
    );

    if (rows.length === 0) {
      throw { status: 404, message: "Patient not found." };
    }

    const patient = rows[0];

    // Doctor can only see their own patients
    if (user.role_name === "DOCTOR" && patient.doctor_id !== user.id) {
      throw {
        status: 403,
        message: "Access denied. This is not your patient.",
      };
    }

    return patient;
  }

  async createPatient(data, user) {
  const {
    name,
    phone,
    address,
    date_of_birth,
    gender,
    doctor_id,
  } = data;

  const medicalRecordNumber = `RM${Date.now()}`;

  const assignedDoctorId =
    user.role_name === "ADMIN"
      ? doctor_id
      : user.id;

  const [result] = await pool.query(
    `INSERT INTO patients (
      doctor_id,
      medical_record_number,
      full_name,
      phone,
      address,
      date_of_birth,
      gender
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      assignedDoctorId,
      medicalRecordNumber,
      name,
      phone || null,
      address || null,
      date_of_birth || null,
      gender || null,
    ]
  );

  return {
    id: result.insertId,
    doctor_id: assignedDoctorId,
    medical_record_number: medicalRecordNumber,
    full_name: name,
    phone,
    address,
    date_of_birth,
    gender,
    status: "ACTIVE",
  };
}

  async updatePatientStatus(patientId, status, user) {
  await this.getPatientById(patientId, user);

  if (user.role_name !== "DOCTOR") {
    throw {
      status: 403,
      message: "Only assigned doctor can update patient status.",
    };
  }

  const validStatuses = ["ACTIVE", "COMPLETE", "INACTIVE"];

  if (!validStatuses.includes(status)) {
    throw {
      status: 400,
      message: "Invalid status.",
    };
  }

  await pool.query(
    "UPDATE patients SET status = ? WHERE id = ?",
    [status, patientId]
  );

  return {
    message: `Patient status updated to ${status}.`,
  };
}

  async updatePatientStatus(patientId, status, user) {
    // Verify ownership
    await this.getPatientById(patientId, user);

    const validStatuses = ["ACTIVE", "COMPLETE", "INACTIVE"];

    if (!validStatuses.includes(status)) {
      throw {
        status: 400,
        message: "Invalid status. Must be ACTIVE, COMPLETE, or INACTIVE.",
      };
    }

    await pool.query(
      "UPDATE patients SET status = ? WHERE id = ?",
      [status, patientId]
    );

    return {
      message: `Patient status updated to ${status}.`,
    };
  }
}

module.exports = new PatientService();