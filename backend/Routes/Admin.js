const express = require('express');
const router = express.Router();
const Customer = require('../Models/customer'); 
const jwt=require('jsonwebtoken')
const { protect } = require('../Middleware/Protect');  

router.get('/customer-count',protect, async (req, res) => {
  try {
    const customerCount = await Customer.countDocuments(); 
    res.status(200).json({ count: customerCount });
  } catch (error) {
    console.error('Error fetching customer count:', error);
    res.status(500).json({ message: 'Error fetching customer count' });
  }
});

router.get('/customers-list',protect, async (req, res) => {
    try {
      const customers = await Customer.find().select('name email createdAt updatedAt');
      res.status(200).json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Failed to fetch customers' });
    }
  });

  router.put('/customers/:id',protect, async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;
  
    if (!newName || newName.trim() === '') {
      return res.status(400).json({ message: 'New name is required and cannot be empty.' });
    }
  
    try {
      const updatedCustomer = await Customer.findByIdAndUpdate(
        id,
        { name: newName.trim() },
        { new: true, runValidators: true } 
      );
  
      if (!updatedCustomer) {
        return res.status(404).json({ message: 'Customer not found.' });
      }
  
      res.status(200).json({
        message: 'Customer name updated successfully.',
        customer: updatedCustomer,
      });
    } catch (error) {
      console.error('Error updating customer name:', error);
      res.status(500).json({ message: 'Failed to update customer name.' });
    }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      if(email==="admin@gmail.com"&&password==="password123")
      {
          const token = jwt.sign(
              { email,Role:"Admin" },
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
