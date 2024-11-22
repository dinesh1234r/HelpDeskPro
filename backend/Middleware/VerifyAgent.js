const verifyAgent = (req, res, next) => {
    const role = req.headers.Role; 
  
    if (!role) {
      return res.status(400).json({ message: 'Role not provided.' });
    }
  
    // Check if the role is 'agent'
    if (role !== 'Agent') {
      return res.status(403).json({ message: 'Access denied. Service agents only.' });
    }
  
    next();  // Allow the request to proceed
  };
  
  module.exports = { verifyAgent };
  