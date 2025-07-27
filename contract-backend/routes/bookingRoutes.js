const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Contractor = require('../models/Contractor');
const User = require('../models/User');
const {auth} = require('../middleware/auth');

// POST /api/bookings - Create a new booking (for clients)
router.post('/', auth, async (req, res) => {
  try {
    const {
      contractorId,
      serviceDetails,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      clientAddress,
      notes,
      totalAmount
    } = req.body;

    const booking = new Booking({
      clientId: req.user.id,
      contractorId,
      serviceDetails,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      clientAddress,
      notes,
      totalAmount,
      status: 'pending'
    });

    await booking.save();

    // Populate the booking with client and contractor details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('clientId', 'name email phone')
      .populate('contractorId', 'businessName services');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/client - Get all bookings for a client
router.get('/client', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ clientId: req.user.id })
      .populate('contractorId', 'businessName services rating')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Client bookings fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to update this booking
    const contractor = await Contractor.findOne({ userId: req.user.id });
    if (!contractor || booking.contractorId.toString() !== contractor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    booking.updatedAt = new Date();

    await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking
    });

  } catch (error) {
    console.error('Booking status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/bookings/:id/payment-status - Update payment status
router.put('/:id/payment-status', auth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = paymentStatus;
    booking.updatedAt = new Date();

    await booking.save();

    res.json({
      message: 'Payment status updated successfully',
      booking
    });

  } catch (error) {
    console.error('Payment status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to cancel this booking
    if (booking.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/:id - Get single booking details
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('clientId', 'name email phone address')
      .populate('contractorId', 'businessName services rating');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    const contractor = await Contractor.findOne({ userId: req.user.id });
    const isContractor = contractor && booking.contractorId._id.toString() === contractor._id.toString();
    const isClient = booking.clientId._id.toString() === req.user.id;

    if (!isContractor && !isClient) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);

  } catch (error) {
    console.error('Booking fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;