const mongoose = require('mongoose');

const savedContractorSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Ensure a client can't save the same contractor twice
savedContractorSchema.index({ clientId: 1, contractorId: 1 }, { unique: true });

module.exports = mongoose.model('SavedContractor', savedContractorSchema);