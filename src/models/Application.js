const mongoose = require('mongoose');

  const applicationSchema = new mongoose.Schema({
      job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      education: [{
          institution: { type: String, required: true },
          degree: { type: String, required: true },
          year: { type: Number, required: true },
      }],
      experience: [{
          company: { type: String, required: true },
          role: { type: String, required: true },
          years: { type: Number, required: true },
      }],
      personalInfo: {
          fullName: { type: String, required: true },
          phone: { type: String, required: true },
          address: { type: String, required: true },
      },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      appliedAt: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Application', applicationSchema);