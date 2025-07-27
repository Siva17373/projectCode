const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Contractor = require('../models/Contractor');
const Booking = require('../models/Booking');
const { auth, authorize } = require('../middleware/auth'); // ✅ correct


// GET /api/contractor/dashboard - Get contractor dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user and contractor data
    const user = await User.findById(userId);
    const contractor = await Contractor.findOne({ userId });
    
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor profile not found' });
    }

    // Get bookings data
    const allBookings = await Booking.find({ contractorId: contractor._id })
      .populate('clientId', 'name email phone')
      .sort({ createdAt: -1 });

    // Calculate stats
    const completedBookings = allBookings.filter(booking => booking.status === 'completed');
    const activeBookings = allBookings.filter(booking => 
      ['accepted', 'in-progress'].includes(booking.status)
    );
    const pendingBookings = allBookings.filter(booking => booking.status === 'pending');

    // Calculate earnings
    const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    // Calculate monthly earnings (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyEarnings = completedBookings
      .filter(booking => {
        const bookingDate = new Date(booking.updatedAt);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      })
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    // Get recent job requests (pending bookings)
    const jobRequests = pendingBookings.slice(0, 10).map(booking => ({
      id: booking._id,
      client: {
        name: booking.clientId.name,
        avatar: booking.clientId.name.split(' ').map(n => n[0]).join(''),
        location: `${booking.clientAddress?.city || 'N/A'}`,
        rating: 4.5, // You can implement client rating system
        phone: booking.clientId.phone
      },
      title: booking.serviceDetails.category,
      description: booking.serviceDetails.description || booking.notes,
      budget: `$${booking.totalAmount}`,
      preferredDate: booking.scheduledDate,
      urgency: booking.estimatedDuration > 4 ? 'high' : booking.estimatedDuration > 2 ? 'medium' : 'low',
      postedTime: getTimeAgo(booking.createdAt),
      distance: '2.5 miles' // You can implement location-based distance calculation
    }));

    // Get active jobs
    const activeJobs = activeBookings.map(booking => ({
      id: booking._id,
      client: {
        name: booking.clientId.name,
        avatar: booking.clientId.name.split(' ').map(n => n[0]).join(''),
        phone: booking.clientId.phone
      },
      title: booking.serviceDetails.category,
      status: booking.status.replace('-', '_'),
      scheduledDate: booking.scheduledDate,
      estimatedCompletion: booking.scheduledDate,
      payment: booking.totalAmount,
      progress: booking.status === 'accepted' ? 0 : booking.status === 'in-progress' ? 50 : 100
    }));

    // Dashboard stats
    const stats = {
      totalEarnings,
      monthlyEarnings,
      completedJobs: contractor.completedJobs || completedBookings.length,
      activeJobs: activeBookings.length,
      averageRating: contractor.rating.average || 0,
      totalReviews: contractor.rating.count || 0,
      responseRate: 95, // You can calculate based on response time data
      repeatClients: calculateRepeatClients(completedBookings)
    };

    res.json({
      user: {
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        businessName: contractor.businessName,
        services: contractor.services.map(s => s.category),
        experience: contractor.experience
      },
      stats,
      jobRequests,
      activeJobs,
      recentReviews: [] // Implement reviews system
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/contractor/respond-to-job - Respond to job request
router.post('/respond-to-job', auth, async (req, res) => {
  try {
    const { bookingId, action, quote } = req.body; // action: 'accept', 'reject', 'quote'
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (action === 'accept') {
      booking.status = 'accepted';
    } else if (action === 'reject') {
      booking.status = 'cancelled';
    } else if (action === 'quote' && quote) {
      booking.totalAmount = quote;
      // You might want to add a quotes system here
    }

    await booking.save();
    res.json({ message: 'Response recorded successfully', booking });

  } catch (error) {
    console.error('Job response error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/contractor/update-job-status - Update job status
router.put('/update-job-status', auth, async (req, res) => {
  try {
    const { bookingId, status, progress } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    if (status === 'completed') {
      // Update contractor stats
      const contractor = await Contractor.findOne({ userId: req.user.id });
      if (contractor) {
        contractor.completedJobs += 1;
        contractor.totalJobs += 1;
        await contractor.save();
      }
    }

    await booking.save();
    res.json({ message: 'Job status updated successfully', booking });

  } catch (error) {
    console.error('Job status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/contractor/update-profile - Update contractor profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, 
      businessName, 
      services, 
      experience, 
      skills, 
      phone, 
      address 
    } = req.body;

    // Update user data
    const user = await User.findByIdAndUpdate(
      userId, 
      { 
        name, 
        phone, 
        address,
        profileCompleted: true 
      }, 
      { new: true }
    );

    // Update contractor data
    const contractor = await Contractor.findOneAndUpdate(
      { userId },
      {
        businessName,
        services: services?.map(service => ({
          category: service.category,
          description: service.description,
          price: service.price,
          priceType: service.priceType || 'hourly'
        })),
        experience,
        skills
      },
      { new: true, upsert: true }
    );

    res.json({ 
      message: 'Profile updated successfully', 
      user, 
      contractor 
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/contractor/earnings - Get detailed earnings data
router.get('/earnings', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const contractor = await Contractor.findOne({ userId });
    
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor profile not found' });
    }

    const { period = 'month' } = req.query; // month, quarter, year
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'month':
        dateFilter = {
          updatedAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
            $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
          }
        };
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        dateFilter = {
          updatedAt: {
            $gte: new Date(now.getFullYear(), quarter * 3, 1),
            $lt: new Date(now.getFullYear(), (quarter + 1) * 3, 1)
          }
        };
        break;
      case 'year':
        dateFilter = {
          updatedAt: {
            $gte: new Date(now.getFullYear(), 0, 1),
            $lt: new Date(now.getFullYear() + 1, 0, 1)
          }
        };
        break;
    }

    const completedBookings = await Booking.find({
      contractorId: contractor._id,
      status: 'completed',
      ...dateFilter
    }).populate('clientId', 'name');

    const pendingPayments = await Booking.find({
      contractorId: contractor._id,
      status: 'completed',
      paymentStatus: 'pending'
    });

    const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const pendingAmount = pendingPayments.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const averagePerJob = completedBookings.length > 0 ? totalEarnings / completedBookings.length : 0;

    const transactions = completedBookings.map(booking => ({
      id: booking._id,
      client: booking.clientId.name,
      job: booking.serviceDetails.category,
      amount: booking.totalAmount,
      date: booking.updatedAt,
      status: booking.paymentStatus
    }));

    res.json({
      totalEarnings,
      periodEarnings: totalEarnings,
      averagePerJob,
      pendingAmount,
      jobCount: completedBookings.length,
      transactions
    });

  } catch (error) {
    console.error('Earnings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
function getTimeAgo(date) {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
}

function calculateRepeatClients(bookings) {
  const clientCounts = {};
  bookings.forEach(booking => {
    const clientId = booking.clientId._id || booking.clientId;
    clientCounts[clientId] = (clientCounts[clientId] || 0) + 1;
  });
  
  const repeatClients = Object.values(clientCounts).filter(count => count > 1).length;
  const totalClients = Object.keys(clientCounts).length;
  
  return totalClients > 0 ? Math.round((repeatClients / totalClients) * 100) : 0;
}

module.exports = router;