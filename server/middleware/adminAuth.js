import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const cookieToken = req.cookies?.adminToken || '';
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: true,
        message: 'Unauthorized. Admin token missing.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.role || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: true,
        message: 'Forbidden. Admin access only.',
      });
    }

    req.admin = {
      id: decoded.adminId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: true,
      message: 'Invalid or expired admin token.',
    });
  }
};

export default adminAuth;
