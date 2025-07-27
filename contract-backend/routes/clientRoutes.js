// routes/client.js - Enhanced client routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Client = require('../models/Client');
const Booking = require('../models/Booking');
const Contractor = require('../models/Contractor');
const SavedContractor = require('../models/SavedContractor');
const mongoose = require('mongoose');

// Error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// GET /api/client/stats
router.get('/stats', auth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching stats for user:', userId);

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const bookingStats = await Booking.aggregate([
      { $match: { clientId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          activeBookings: {
            $sum: {
              $cond: [
                { $in: ['$status', ['scheduled', 'in_progress', 'accepted']] },
                1,
                0
              ]
            }
          },
          completedBookings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          totalSpent: { $sum: '$price' },
          avgRating: { $avg: '$clientRating.rating' }
        }
      }
    ]);

    const savedContractorsCount = await SavedContractor.countDocuments({
      clientId: userId
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newBookingsThisMonth = await Booking.countDocuments({
      clientId: userId,
      createdAt: { $gte: startOfMonth }
    });

    const stats = {
      totalBookings: bookingStats[0]?.totalBookings || 0,
      activeBookings: bookingStats[0]?.activeBookings || 0,
      completedBookings: bookingStats[0]?.completedBookings || 0,
      savedContractors: savedContractorsCount,
      totalSpent: bookingStats[0]?.totalSpent || 0,
      averageRating: parseFloat((bookingStats[0]?.avgRating || 0).toFixed(1)),
      newBookingsThisMonth
    };

    console.log('Stats calculated:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching client stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}));

// GET /api/client/bookings
router.get('/bookings', auth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    console.log('Fetching bookings for user:', userId, 'with filters:', { status, page, limit });

    const query = { clientId: userId };
    if (status && status !== 'All Status' && status !== 'all') {
      query.status = status.toLowerCase().replace(' ', '_');
    }

    const bookings = await Booking.find(query)
      .populate('contractorId', 'firstName lastName avatar services rating phone businessName')
      .sort({ scheduledDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const totalBookings = await Booking.countDocuments(query);

    const formatted = bookings.map(booking => ({
      id: booking._id,
      description: booking.description || booking.title || 'Service Request',
      status: booking.status,
      scheduledDate: booking.scheduledDate,
      price: booking.price || 0,
      estimatedDuration: booking.estimatedDuration || '2 hours',
      location: booking.location || booking.address || 'Location not specified',
      createdAt: booking.createdAt,
      contractor: {
        id: booking.contractorId?._id,
        name: booking.contractorId ? 
          `${booking.contractorId.firstName || ''} ${booking.contractorId.lastName || ''}`.trim() : 
          'Contractor not found',
        avatar: booking.contractorId?.avatar || 
          (booking.contractorId?.firstName ? 
            `${booking.contractorId.firstName[0]}${booking.contractorId.lastName?.[0] || ''}` : 
            'NA'),
        service: booking.contractorId?.services?.[0] || booking.service || 'General Service',
        rating: booking.contractorId?.rating || 0,
        phone: booking.contractorId?.phone || 'N/A',
        businessName: booking.contractorId?.businessName
      }
    }));

    res.json({
      bookings: formatted,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBookings / parseInt(limit)),
        totalBookings,
        hasMore: (parseInt(page) * parseInt(limit)) < totalBookings
      }
    });
  } catch (error) {
    console.error('Error fetching client bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}));

// GET /api/client/saved-contractors
router.get('/saved-contractors', auth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching saved contractors for user:', userId);

    const savedContractors = await SavedContractor.find({ clientId: userId })
      .populate('contractorId', 'firstName lastName avatar services rating location hourlyRate responseTime completedJobs verified businessName')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = savedContractors
      .filter(saved => saved.contractorId) // Filter out null contractors
      .map(saved => ({
        id: saved.contractorId._id,
        name: `${saved.contractorId.firstName || ''} ${saved.contractorId.lastName || ''}`.trim(),
        avatar: saved.contractorId.avatar || 
          `${saved.contractorId.firstName?.[0] || ''}${saved.contractorId.lastName?.[0] || ''}`,
        rating: saved.contractorId.rating || 0,
        services: saved.contractorId.services || [],
        location: saved.contractorId.location || 'Location not specified',
        hourlyRate: saved.contractorId.hourlyRate || 0,
        responseTime: saved.contractorId.responseTime || '1 hour',
        completedJobs: saved.contractorId.completedJobs || 0,
        verified: saved.contractorId.verified || false,
        businessName: saved.contractorId.businessName,
        savedAt: saved.createdAt
      }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching saved contractors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}));

// POST /api/client/saved-contractors
router.post('/saved-contractors', auth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const { contractorId } = req.body;

    if (!contractorId) {
      return res.status(400).json({ message: 'Contractor ID is required' });
    }

    const existing = await SavedContractor.findOne({ 
      clientId: userId, 
      contractorId 
    });

    if (existing) {
      return res.status(400).json({ message: 'Contractor already saved' });
    }

    const savedContractor = new SavedContractor({ 
      clientId: userId, 
      contractorId 
    });
    await savedContractor.save();

    res.status(201).json({ message: 'Contractor saved successfully' });
  } catch (error) {
    console.error('Error saving contractor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}));

// DELETE /api/client/saved-contractors/:contractorId
router.delete('/saved-contractors/:contractorId', auth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const { contractorId } = req.params;

    await SavedContractor.findOneAndDelete({ 
      clientId: userId, 
      contractorId 
    });

    res.json({ message: 'Contractor removed from saved list' });
  } catch (error) {
    console.error('Error removing saved contractor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}));

// GET /api/client/recommendations
router.get('/recommendations', auth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching recommendations for user:', userId);

    // Get user's booking history to understand preferences
    const bookings = await Booking.find({ clientId: userId })
      .populate('contractorId', 'services')
      .lean();

    const preferredServices = [];
    bookings.forEach(booking => {
      if (booking.contractorId?.services) {
        preferredServices.push(...booking.contractorId.services);
      }
      if (booking.service) {
        preferredServices.push(booking.service);
      }
    });

    // Get already saved contractor IDs
    const savedIds = await SavedContractor.find({ clientId: userId })
      .distinct('contractorId');

    // Build query for recommendations
    const query = {
      _id: { $nin: savedIds },
      userId: { $ne: userId } // Don't recommend the user themselves if they're also a contractor
    };

    // If user has service preferences, use them; otherwise use popular services
    if (preferredServices.length > 0) {
      query.services = { $in: preferredServices };
    } else {
      query.services = { $in: ['Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting'] };
    }

    const recommendations = await Contractor.find(query)
      .sort({ rating: -1, completedJobs: -1 })
      .limit(6)
      .lean();

    const formatted = recommendations.map(c => ({
      id: c._id,
      name: `${c.firstName || ''} ${c.lastName || ''}`.trim(),
      avatar: c.avatar || `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`,
      rating: c.rating || 0,
      service: c.services?.[0] || 'General Service',
      location: c.location || 'Location not specified',
      hourlyRate: c.hourlyRate || 50,
      specialties: c.specialties || c.services?.slice(0, 2) || [],
      availability: c.availability || 'Available',
      completedJobs: c.completedJobs || 0,
      businessName: c.businessName,
      verified: c.verified || false,
      responseTime: c.responseTime || '1 hour'
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}));

// GET /api/client/profile
router.get('/profile', auth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching profile for user:', userId);

    // First try to find existing client profile
    let client = await Client.findOne({ userId }).lean();
    
    // If no client profile exists, get user data and create default profile
    if (!client) {
      const user = await User.findById(userId).lean();
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create default client profile
      client = {
        userId: userId,
        propertyType: '',
        budget: '',
        notifications: {
          booking_updates: true,
          new_messages: true,
          payment_reminders: true,
          recommendations: true,
          promotions: false
        }
      };

      // Save the default profile
      const newClient = new Client(client);
      await newClient.save();
    }

    const profile = {
      propertyType: client.propertyType || '',
      budget: client.budget || '',
      notifications: client.notifications || {
        booking_updates: true,
        new_messages: true,
        payment_reminders: true,
        recommendations: true,
        promotions: false
      }
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching client profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}));

// PUT /api/client/profile
router.put('/profile', auth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    console.log('Updating profile for user:', userId, 'with data:', updates);

    const client = await Client.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Failed to update profile' });
    }

    res.json({ message: 'Profile updated successfully', profile: client });
  } catch (error) {
    console.error('Error updating client profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}));

// GET /api/client/recent-activity
router.get('/recent-activity', auth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 10 } = req.query;

    // Get recent bookings with contractor info
    const recentBookings = await Booking.find({ clientId: userId })
      .populate('contractorId', 'firstName lastName businessName')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const activities = recentBookings.map(booking => ({
      id: booking._id,
      type: 'booking',
      title: `Booking ${booking.status}`,
      description: `${booking.description || 'Service request'} with ${
        booking.contractorId ? 
        `${booking.contractorId.firstName} ${booking.contractorId.lastName}` : 
        'contractor'
      }`,
      timestamp: booking.updatedAt,
      status: booking.status,
      amount: booking.price
    }));

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}));

module.exports = router;