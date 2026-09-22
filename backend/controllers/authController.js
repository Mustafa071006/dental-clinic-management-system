const authService = require("../services/authService");

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required.",
        });
      }

      const result = await authService.login(email, password);

      res.json({
        success: true,
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Internal server error.";
      res.status(status).json({ success: false, message });
    }
  }

  async forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    const result =
      await authService.forgotPassword(email);

    res.json({
      success: true,
      role: result.role,
    });
  } catch (error) {
    const status = error.status || 500;

    res.status(status).json({
      success: false,
      message:
        error.message || 'Internal server error.',
    });
  }
}

  async getProfile(req, res) {
    try {
      const profile = await authService.getProfile(req.user.id);

      res.json({
        success: true,
        user: profile,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Internal server error.";
      res.status(status).json({ success: false, message });
    }
  }
}

module.exports = new AuthController();