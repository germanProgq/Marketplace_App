const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const checkRole = (allowedRoles) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const { role } = decodedToken;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    next();
  });
};
module.exports = checkRole