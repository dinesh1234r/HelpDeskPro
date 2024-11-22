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

router.get('/:ticketId/messages', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId })
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ messages: ticket.messages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages for the ticket' });
  }
});

router.post('/:ticketId/messages', protect, async (req, res) => {
  const { content, sender } = req.body; 

  if (!content || !sender) {
    return res.status(400).json({ message: 'Message content and sender are required' });
  }

  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const newMessage = {
      sender,
      content,
      timestamp: new Date(),
    };

    ticket.messages.push(newMessage);
    ticket.updatedAt = new Date(); 
    await ticket.save();

    res.status(201).json(newMessage); // Respond with the added message
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
