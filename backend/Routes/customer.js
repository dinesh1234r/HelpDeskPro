const express = require('express');
const router = express.Router();
const Customer = require('../Models/customer');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt')
const {protect} =require('../Middleware/Protect')

const generateToken = (id) => {
  return jwt.sign({ id,Role:"Customer" },process.env.SECURITY_KEY); 
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Customer.create({ name, email, password: hashedPassword });

    if (customer) {
      res.status(201).json({
        id: customer._id,
        name: customer.name,
        email: customer.email,
        token: generateToken(customer._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid customer data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Received data:', req.body);
  console.log(email+" "+password) 
  
  try {
    const customer = await Customer.findOne({ email });
    if (customer) {
      const isMatch = await bcrypt.compare(password, customer.password);
console.log('Hashed Password from DB:', customer.password);  
console.log('Password being compared:', password);   
      if (isMatch) {
        return res.json({
          id: customer._id,
          name: customer.name,
          email: customer.email,
          token: generateToken(customer._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/update-password', protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide both old and new passwords' });
  }

  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, customer.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    customer.password = hashedPassword;
    await customer.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
