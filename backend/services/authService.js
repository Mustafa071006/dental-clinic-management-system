const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");
const config = require("../config/config");

class AuthService {
  async login(email, password) {
    const [rows] = await pool.query(
      `SELECT u.id, u.role_id, u.email, u.password, u.name, u.status, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      throw { status: 401, message: "Invalid email or password." };
    }

    const user = rows[0];

    // Check if user is active
    if (user.status !== "ACTIVE") {
      throw { status: 403, message: "User account is not active." };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw { status: 401, message: "Invalid email or password." };
    }

    const token = jwt.sign(
      {
        id: user.id,
        role_id: user.role_id,
        email: user.email,
        name: user.name,
        role_name: user.role_name,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
      },
    };
  }

    async forgotPassword(email) {
  const [rows] = await pool.query(
    `
    SELECT
      u.id,
      r.name AS role_name
    FROM users u
    JOIN roles r
      ON u.role_id = r.id
    WHERE u.email = ?
    `,
    [email]
  );

  if (rows.length === 0) {
    throw {
      status: 404,
      message: 'Email not found.',
    };
  }

  return {
    role: rows[0].role_name,
  };
}

  async getProfile(userId) {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.name, u.status, r.name AS role_name, u.created_at
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      throw { status: 404, message: "User not found." };
    }

    const user = rows[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role_name,
      status: user.status,
      created_at: user.created_at,
    };
  }
}

module.exports = new AuthService();