const jwt = require('jsonwebtoken');

 
const auth = (req, res, next) => {
  console.log('Cookies received:', req.cookies);
  console.log('Headers:', req.headers);

  let token = req.cookies.token;
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '');
  }

  console.log("Token:", token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded user info:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(400).json({ message: 'Invalid token' });
  }
};
module.exports = { auth };
