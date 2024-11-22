const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
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
