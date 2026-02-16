import mongoose from 'mongoose';

const parcelSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  courier: { type: String, required: true },
  trackingId: { type: String },
  receivedDate: { type: Date, default: Date.now },
  collected: { type: Boolean, default: false },
}, { timestamps: true });

export const Parcel = mongoose.model('Parcel', parcelSchema);
