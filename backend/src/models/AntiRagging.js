import mongoose from 'mongoose';

const antiRaggingSchema = new mongoose.Schema({
  victim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  victimName: String,
  victimRollNumber: String,
  accusedName: {
    type: String,
    required: true
  },
  incidentLocation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  dateReported: {
    type: Date,
    default: Date.now
  }
});

export const AntiRagging = mongoose.model('AntiRagging', antiRaggingSchema);
