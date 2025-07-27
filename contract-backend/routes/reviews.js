
// routes/reviews.js - Review handling routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { updateContractorRating } = require('../utils/helpers');

// POST /api/reviews - Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, rating, review, aspects, wouldRecommend } = req.body;
    const clientId = req.user.id;

    // Verify booking exists and belongs to client
    const booking = await Booking.findOne({
      _id: bookingId,
      clientId: clientId,
      status: 'completed'
    });

    if (!booking) {
      return res.status(400).json({ 
        message: 'Booking not found or not completed' 
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ 
        message: 'Review already exists for this booking' 
      });
    }

    // Create review
    const newReview = new Review({
      bookingId,
      clientId,
      contractorId: booking.contractorId,
      rating,
      review,
      aspects,
      wouldRecommend
    });

    await newReview.save();

    // Update contractor's overall rating
    await updateContractorRating(booking.contractorId);

    // Update booking with review
    await Booking.findByIdAndUpdate(bookingId, {
      'clientRating.rating': rating,
      'clientRating.review': review,
      'clientRating.ratedAt': new Date()
    });

    res.status(201).json({ 
      message: 'Review submitted successfully',
      review: newReview 
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/contractor/:contractorId - Get reviews for a contractor
router.get('/contractor/:contractorId', async (req, res) => {
  try {
    const { contractorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ contractorId })
      .populate('clientId', 'firstName lastName avatar')
      .populate('bookingId', 'title category completedAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments({ contractorId });

    res.json({
      reviews,
      totalReviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit)
    });

  } catch (error) {
    console.error('Error fetching contractor reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/client/:clientId - Get reviews by a client
router.get('/client/:clientId', auth, async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Ensure client can only see their own reviews
    if (req.user.id !== clientId && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reviews = await Review.find({ clientId })
      .populate('contractorId', 'firstName lastName avatar services')
      .populate('bookingId', 'title category completedAt')
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    console.error('Error fetching client reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
