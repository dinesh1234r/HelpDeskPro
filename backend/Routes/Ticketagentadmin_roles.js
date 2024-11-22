const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/Protect');
const { verifyAgent } = require('../Middleware/VerifyAgent');
const Ticket = require('../Models/Ticket'); // Assuming you have a Ticket model

// Example route for getting tickets
router.get('/getalltickets',protect, async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate('customerId', 'name email');  // Populate the 'customerId' field with 'name' and 'email'
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tickets.' });
    }
  });
  

  router.put('/:ticket_id/status',protect, async (req, res) => {
    const { ticket_id } = req.params;
    const { status } = req.body;
   
    try {
      const ticket = await Ticket.findById({  _id:ticket_id }); 
       console.log(ticket)
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      ticket.status = status;  
      await ticket.save();     
  
      res.json({ message: `Ticket ${ticket_id} status updated to ${status}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating ticket status' });
    }
  });
  

module.exports = router;
