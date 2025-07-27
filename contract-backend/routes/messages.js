// routes/messages.js - Message handling routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Booking = require('../models/Booking');

// GET /api/messages/:bookingId - Get messages for a booking
router.get('/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Verify user has access to this booking
    const booking = await Booking.findOne({
      _id: bookingId,
      $or: [
        { clientId: userId },
        { contractorId: userId }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or access denied' });
    }

    // Get messages
    const messages = await Message.find({ bookingId })
      .populate('senderId', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read for the current user
    await Message.updateMany({
      bookingId,
      receiverId: userId,
      isRead: false
    }, {
      isRead: true,
      readAt: new Date()
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages - Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, message, messageType = 'text' } = req.body;
    const senderId = req.user.id;
    const senderType = req.user.userType;

    // Get booking to determine receiver
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Determine receiver
    let receiverId, receiverType;
    if (senderType === 'client') {
      receiverId = booking.contractorId;
      receiverType = 'contractor';
    } else {
      receiverId = booking.clientId;
      receiverType = 'client';
    }

    // Create message
    const newMessage = new Message({
      bookingId,
      senderId,
      senderType,
      receiverId,
      receiverType,
      message,
      messageType
    });

    await newMessage.save();
    await newMessage.populate('senderId', 'firstName lastName avatar');

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/unread/count - Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
