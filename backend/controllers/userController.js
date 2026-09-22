const userService = require('../services/userService');

class UserController {
  async getAllDoctors(req, res) {
    try {
      const doctors = await userService.getAllDoctors();
      res.json({
        message: 'Doctors retrieved successfully.',
        data: doctors,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }

  async createDoctor(req, res) {
  try {
    const {
  email,
  password,
  name,
  specialization
} = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Email, password, and name are required.'
      });
    }

    const doctor = await userService.createDoctor({
  email,
  password,
  name,
  specialization
});

    res.status(201).json({
      message: 'Doctor created successfully.',
      data: doctor,
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error.';
    res.status(status).json({ message });
  }
}

async updateDoctor(req, res) {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      specialization,
      password
    } = req.body;

    const doctor = await userService.updateDoctor(
      parseInt(id),
      {
        name,
        email,
        specialization,
        password
      }
    );

    res.json({
      message: 'Doctor updated successfully.',
      data: doctor
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error.';
    res.status(status).json({ message });
  }
}

  async resetPassword(req, res) {
    try {
      const { id } = req.params;
      const { new_password } = req.body;

      if (!new_password) {
        return res.status(400).json({ message: 'New password is required.' });
      }

      const result = await userService.resetPassword(parseInt(id), new_password);

      res.json({
        message: result.message,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }

  async changePassword(req, res) {
    try {
      const { old_password, new_password } = req.body;

      if (!old_password || !new_password) {
        return res.status(400).json({ message: 'Old password and new password are required.' });
      }

      const result = await userService.changePassword(req.user.id, old_password, new_password);

      res.json({
        message: result.message,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal server error.';
      res.status(status).json({ message });
    }
  }

  async toggleDoctorStatus(req, res) {
  try {
    const { id } = req.params;

    const result =
      await userService.toggleDoctorStatus(
        parseInt(id)
      );

    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    const message =
      error.message || 'Internal server error.';

    res.status(status).json({ message });
  }
}

  async deleteDoctor(req, res) {
  try {
    const { id } = req.params;

    const result = await userService.deleteDoctor(
      parseInt(id)
    );

    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error.';
    res.status(status).json({ message });
  }
}

}

module.exports = new UserController();
