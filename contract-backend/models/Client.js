const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'townhouse'],
    default: null
  },
  budget: {
    type: String,
    enum: ['0-100', '100-500', '500-1000', '1000-5000', '5000+'],
    default: null
  },
  notifications: {
    booking_updates: { type: Boolean, default: true },
    new_messages: { type: Boolean, default: true },
    payment_reminders: { type: Boolean, default: true },
    recommendations: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);