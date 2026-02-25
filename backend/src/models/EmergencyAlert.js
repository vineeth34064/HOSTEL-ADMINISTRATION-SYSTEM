import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  roomDetails: { type: String },
  emergencyType: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'acknowledged'], default: 'sent' },
}, { timestamps: true });

export const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);
