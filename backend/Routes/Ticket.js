const express = require('express');
const router = express.Router();
const Ticket = require('../Models/Ticket');
const Customer = require('../Models/customer');
const { protect } = require('../Middleware/Protect');  

router.post('/put-ticket', protect, async (req, res) => {
  const { title, description } = req.body;

  const customerId = req.user.id;  

  if (!title || !description) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const ticket = new Ticket({
      title,
      description,
      customerId,
    });

    const savedTicket = await ticket.save();

    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
});

router.get('/get-tickets', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
});

module.exports = router;
