const bcrypt = require('bcryptjs');
const pool = require('../database/db');

class UserService {
  async getAllDoctors() {
  const [rows] = await pool.query(
    `SELECT
      u.id,
      u.email,
      u.name,
      u.specialization,
      u.status,
      r.name AS role_name,
      u.created_at,
      u.updated_at
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE r.name = 'DOCTOR'
     ORDER BY u.created_at DESC`
  );

  return rows;
}

  async createDoctor(data) {
  const {
    email,
    password,
    name,
    specialization
  } = data;

  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existing.length > 0) {
    throw {
      status: 409,
      message: 'Email already exists.',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `INSERT INTO users
     (
       role_id,
       email,
       password,
       name,
       specialization,
       status
     )
     VALUES
     (
       2,
       ?,
       ?,
       ?,
       ?,
       'ACTIVE'
     )`,
    [
      email,
      hashedPassword,
      name,
      specialization
    ]
  );

  return {
    id: result.insertId,
    email,
    name,
    specialization,
    role: 'DOCTOR',
  };
}

  async updateDoctor(id, data) {
  const {
    name,
    email,
    specialization,
    password
  } = data;

  const [rows] = await pool.query(
    'SELECT id FROM users WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw {
      status: 404,
      message: 'Doctor not found.'
    };
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users
       SET
         name = ?,
         email = ?,
         specialization = ?,
         password = ?
       WHERE id = ?`,
      [
        name,
        email,
        specialization,
        hashedPassword,
        id
      ]
    );
  } else {
    await pool.query(
      `UPDATE users
       SET
         name = ?,
         email = ?,
         specialization = ?
       WHERE id = ?`,
      [
        name,
        email,
        specialization,
        id
      ]
    );
  }

  return {
    id,
    name,
    email,
    specialization
  };
}

  async resetPassword(userId, newPassword) {
  const [rows] = await pool.query(
    `SELECT
      u.id,
      r.name AS role_name
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = ?`,
    [userId]
  );

  if (rows.length === 0) {
    throw {
      status: 404,
      message: 'User not found.',
    };
  }

  if (rows[0].role_name !== 'DOCTOR') {
    throw {
      status: 403,
      message: 'Can only reset password for doctors.',
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, userId]
  );

  return {
    message: 'Password reset successfully.',
  };
}

  async changePassword(userId, oldPassword, newPassword) {
    const [rows] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      throw {
        status: 404,
        message: 'User not found.',
      };
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      rows[0].password
    );

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: 'Current password is incorrect.',
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    return {
      message: 'Password changed successfully.',
    };
  }

  async toggleDoctorStatus(id) {
  const [rows] = await pool.query(
    'SELECT id, status FROM users WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw {
      status: 404,
      message: 'Doctor not found.'
    };
  }

  const currentStatus = rows[0].status;

  const newStatus =
    currentStatus === 'ACTIVE'
      ? 'INACTIVE'
      : 'ACTIVE';

  await pool.query(
    'UPDATE users SET status = ? WHERE id = ?',
    [newStatus, id]
  );

  return {
    message: `Doctor status updated to ${newStatus}.`,
    status: newStatus
  };
}

  async deleteDoctor(id) {
  const [rows] = await pool.query(
    'SELECT id FROM users WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw {
      status: 404,
      message: 'Doctor not found.'
    };
  }

  await pool.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );

  return {
    message: 'Doctor deleted successfully.'
  };
}

}

module.exports = new UserService();