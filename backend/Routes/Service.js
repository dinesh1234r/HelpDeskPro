const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST route for admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists by email
    if(email==="service@gmail.com"&&password==="password123")
    {
        const token = jwt.sign(
            { email,Role:"Agent" },
            process.env.SECURITY_KEY
          );
          return res.status(200).json({
            message: 'Login successful',
            token,
          });
    }
    res.send({
        message:"You are not authorized"
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
