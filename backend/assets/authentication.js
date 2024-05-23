const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const base64EncodedKey = process.env.JWT_SECRET_KEY;

const isAuthenticated = (req, res, next) => { 
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.error("Authorization header missing");
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.error("Token not provided");
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, base64EncodedKey, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message); 
      return res.status(403).json({ error: 'Forbidden' }); 
    }

    req.user = user;
    next();
  });
};

module.exports = isAuthenticated;
