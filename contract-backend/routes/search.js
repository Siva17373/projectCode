const express = require('express');
const router = express.Router();
const Contractor = require('../models/Contractor');
const { calculateDistance } = require('../utils/helpers');

// GET /api/search/contractors - Search contractors
router.get('/contractors', async (req, res) => {
  try {
    const {
      service,
      location,
      minRating = 0,
      maxRate,
      availability,
      sortBy = 'rating',
      page = 1,
      limit = 10,
      lat,
      lng,
      radius = 25
    } = req.query;

    // Base query
    let query = {
      isActive: true,
      verified: true
    };

    if (service && service !== 'all') {
      query.services = { $in: [service] };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minRating > 0) {
      query.rating = { $gte: Number(minRating) };
    }

    if (maxRate) {
      query.hourlyRate = { $lte: Number(maxRate) };
    }

    if (availability) {
      query.availability = { $regex: availability, $options: 'i' };
    }

    const contractors = await Contractor.find(query)
      .select('firstName lastName avatar services rating hourlyRate location coordinates availability completedJobs specialties')
      .lean();

    let filteredContractors = contractors;

    // If lat/lng provided, filter by distance
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      filteredContractors = contractors.filter(contractor => {
        const coords = contractor.address?.coordinates;
        if (!coords?.lat || !coords?.lng) return false;

        const distance = calculateDistance(latitude, longitude, coords.lat, coords.lng);
        contractor.distance = distance;
        return distance <= radius;
      });
    }

    // Sort contractors
    const sortField = sortBy === 'rate' ? 'hourlyRate' : sortBy === 'jobs' ? 'completedJobs' : 'rating';
    filteredContractors.sort((a, b) => (b[sortField] || 0) - (a[sortField] || 0));

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginated = filteredContractors.slice(startIndex, endIndex);

    res.json({
      contractors: paginated,
      totalResults: filteredContractors.length,
      totalPages: Math.ceil(filteredContractors.length / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Error searching contractors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
