// routes/client.js
const express = require('express');
const router = express.Router();
const { authenticateToken: auth } = require('../middleware/auth');





const Client = require('../models/Client');
const Booking = require('../models/Booking');
const Contractor = require('../models/Contractor');
const SavedContractor = require('../models/SavedContractor'); // Optional depending on implementation
const User = require('../models/User');

// GET /api/client/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const client = await Client.findOne({ userId });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const bookingStats = await Booking.aggregate([
      { $match: { clientId: client._id } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          activeBookings: {
            $sum: { $cond: [{ $in: ['$status', ['scheduled', 'in_progress']] }, 1, 0] }
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalSpent: { $sum: '$price' },
          avgRating: { $avg: '$clientRating' }
        }
      }
    ]);

    const savedCount = await SavedContractor.countDocuments({ clientId: client._id });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newBookingsThisMonth = await Booking.countDocuments({
      clientId: client._id,
      createdAt: { $gte: startOfMonth }
    });

    const stats = {
      totalBookings: bookingStats[0]?.totalBookings || 0,
      activeBookings: bookingStats[0]?.activeBookings || 0,
      completedBookings: bookingStats[0]?.completedBookings || 0,
      savedContractors: savedCount,
      totalSpent: bookingStats[0]?.totalSpent || 0,
      averageRating: bookingStats[0]?.avgRating || 0,
      newBookingsThisMonth
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/client/bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const client = await Client.findOne({ userId });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const bookings = await Booking.find({ clientId: client._id })
      .populate('contractorId', 'businessName services rating userId')
      .sort({ scheduledDate: -1 });

    const formatted = bookings.map(booking => ({
      id: booking._id,
      description: booking.description,
      status: booking.status,
      scheduledDate: booking.scheduledDate,
      price: booking.price,
      estimatedDuration: booking.estimatedDuration,
      location: booking.location,
      contractor: {
        name: booking.contractorId?.businessName || 'N/A',
        service: booking.contractorId?.services[0]?.category || 'General',
        rating: booking.contractorId?.rating?.average || 0
      }
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/client/saved-contractors
router.get('/saved-contractors', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const client = await Client.findOne({ userId });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const savedList = await SavedContractor.find({ clientId: client._id })
      .populate('contractorId');

    const contractors = savedList.map(item => {
      const c = item.contractorId;
      return {
        id: c._id,
        name: c.businessName,
        avatar: c.avatar,
        rating: c.rating?.average || 0,
        hourlyRate: c.services?.[0]?.price || 0,
        services: c.services.map(s => s.category),
        location: c.location || 'N/A',
        verified: c.isActive
      };
    });

    res.json(contractors);
  } catch (err) {
    console.error('Error fetching saved contractors:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/client/saved-contractors
router.post('/saved-contractors', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const client = await Client.findOne({ userId });
    const { contractorId } = req.body;

    const exists = await SavedContractor.findOne({
      clientId: client._id,
      contractorId
    });

    if (exists) {
      return res.status(409).json({ message: 'Already saved' });
    }

    await SavedContractor.create({ clientId: client._id, contractorId });
    res.status(201).json({ message: 'Saved successfully' });
  } catch (err) {
    console.error('Error saving contractor:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/client/saved-contractors/:contractorId
router.delete('/saved-contractors/:contractorId', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const contractorId = req.params.contractorId;
    const client = await Client.findOne({ userId });

    await SavedContractor.findOneAndDelete({
      clientId: client._id,
      contractorId
    });

    res.json({ message: 'Removed from saved' });
  } catch (err) {
    console.error('Error removing saved contractor:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/client/recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const client = await Client.findOne({ userId });

    const bookings = await Booking.find({ clientId: client._id }).populate('contractorId');
    const preferredServices = bookings.flatMap(b => b.contractorId?.services?.map(s => s.category)).filter(Boolean);

    const savedIds = await SavedContractor.find({ clientId: client._id }).distinct('contractorId');

    const contractors = await Contractor.find({
      _id: { $nin: savedIds },
      'services.category': { $in: preferredServices.length > 0 ? preferredServices : ['General'] }
    }).limit(5).sort({ 'rating.average': -1 });

    const formatted = contractors.map(c => ({
      id: c._id,
      name: c.businessName,
      avatar: c.avatar,
      rating: c.rating?.average || 0,
      service: c.services[0]?.category || 'General',
      hourlyRate: c.services[0]?.price || 0,
      availability: 'Available now',
      specialties: c.skills?.slice(0, 2) || []
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/client/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const client = await Client.findOne({ userId });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({
      propertyType: client.propertyType,
      budget: client.budget,
      notifications: client.notifications
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/client/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    const client = await Client.findOneAndUpdate({ userId }, updates, { new: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({ message: 'Profile updated', profile: client });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
