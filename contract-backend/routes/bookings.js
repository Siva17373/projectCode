// routes/bookings.js - Booking related routes
const express = require('express');
const router = express.Router();
const { authenticateToken: auth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Message = require('../models/Message');

// POST /api/bookings/:bookingId/message - Send message to contractor
router.post('/:bookingId/message', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { message } = req.body;
    const clientId = req.user.id;

    // Verify booking belongs to client
    const booking = await Booking.findOne({
      _id: bookingId,
      clientId: clientId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create message
    const newMessage = new Message({
      bookingId: bookingId,
      senderId: clientId,
      senderType: 'client',
      receiverId: booking.contractorId,
      receiverType: 'contractor',
      message: message,
      timestamp: new Date()
    });

    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/bookings/:bookingId/call - Log call action
router.post('/:bookingId/call', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const clientId = req.user.id;

    // Verify booking belongs to client
    const booking = await Booking.findOne({
      _id: bookingId,
      clientId: clientId
    }).populate('contractorId', 'phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Log the call attempt
    await Booking.findByIdAndUpdate(bookingId, {
      $push: {
        callLog: {
          timestamp: new Date(),
          initiator: 'client'
        }
      }
    });

    res.json({ 
      message: 'Call logged successfully',
      contractorPhone: booking.contractorId.phone
    });
  } catch (error) {
    console.error('Error logging call:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;