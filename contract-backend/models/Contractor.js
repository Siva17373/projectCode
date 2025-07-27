const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    trim: true
  },
  services: [{
    category: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    priceType: {
      type: String,
      enum: ['hourly', 'fixed', 'daily'],
      default: 'hourly'
    }
  }],
  experience: {
    type: Number,
    default: 0
  },
  skills: [String],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    documentUrl: String
  }],
  availability: {
    monday: { available: Boolean, hours: String },
    tuesday: { available: Boolean, hours: String },
    wednesday: { available: Boolean, hours: String },
    thursday: { available: Boolean, hours: String },
    friday: { available: Boolean, hours: String },
    saturday: { available: Boolean, hours: String },
    sunday: { available: Boolean, hours: String }
  },
  portfolio: [{
    title: String,
    description: String,
    imageUrl: String,
    completedDate: Date
  }],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalJobs: {
    type: Number,
    default: 0
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contractor', contractorSchema);