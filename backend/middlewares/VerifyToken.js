import jwt from 'jsonwebtoken';

export const VerifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};
