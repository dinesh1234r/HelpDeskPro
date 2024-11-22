const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    if(jwt.verify(token, process.env.SECURITY_KEY))
      {
        const decoded = jwt.decode(token);
        if(decoded.Role=="Customer")
        {
          req.user = decoded;  
        }
        next();  
      }  
    
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect };
