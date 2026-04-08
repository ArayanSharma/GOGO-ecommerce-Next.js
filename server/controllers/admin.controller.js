import jwt from 'jsonwebtoken';
import AdminModel from '../models/admin.model.js';

const getTokenPayload = (admin) => ({
  adminId: String(admin?._id),
  email: admin?.email,
  role: 'admin',
});

const signAdminToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

const isBcryptHash = (value) => /^\$2[aby]\$\d{2}\$.{53}$/.test(String(value || ''));

export const adminLoginController = async (req, res) => {
  try {
    const emailInput = req.body?.gmail || req.body?.email;
    const password = req.body?.password;

    if (typeof emailInput !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Gmail and password are required.',
      });
    }

    const email = emailInput.trim().toLowerCase();

    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: true,
        message: 'Admin account not found in database.',
      });
    }

    if (admin.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: true,
        message: 'Admin account is inactive.',
      });
    }

    const hasHashedPassword = isBcryptHash(admin.password);

    let isPasswordValid = false;

    if (hasHashedPassword) {
      isPasswordValid = await admin.comparePassword(password);
    } else {
      // Backward compatibility for old plaintext admin records.
      isPasswordValid = admin.password === password;

      // Upgrade plaintext password to hashed password after successful login.
      if (isPasswordValid) {
        admin.password = password;
        await admin.save();
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: true,
        message: 'Invalid password.',
      });
    }

    const token = signAdminToken(getTokenPayload(admin));

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Admin login successful.',
      data: {
        token,
        admin: {
          id: String(admin._id),
          name: admin.name || 'Administrator',
          email: admin.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Admin login failed.',
    });
  }
};

export const adminProfileController = async (req, res) => {
  return res.status(200).json({
    success: true,
    error: false,
    data: {
      admin: req.admin,
    },
  });
};

export const adminLogoutController = async (req, res) => {
  return res.status(200).json({
    success: true,
    error: false,
    message: 'Admin logged out successfully.',
  });
};

export const adminChangePasswordController = async (req, res) => {
  try {
    const adminId = req.admin?.id;
    const currentPassword = req.body?.currentPassword;
    const newPassword = req.body?.newPassword;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: 'Unauthorized request.',
      });
    }

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Current password and new password are required.',
      });
    }

    if (newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const admin = await AdminModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Admin not found.',
      });
    }

    const hasHashedPassword = isBcryptHash(admin.password);
    const isPasswordValid = hasHashedPassword
      ? await admin.comparePassword(currentPassword)
      : admin.password === currentPassword;

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Current password is incorrect.',
      });
    }

    admin.password = newPassword.trim();
    await admin.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Password updated successfully. Please log in again.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Failed to update password.',
    });
  }
};
