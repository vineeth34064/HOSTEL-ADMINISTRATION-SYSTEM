import mongoose from 'mongoose';

const gatePassSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  reason: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'out', 'in', 'rejected'], default: 'pending' },
  approvalQrCodeData: { type: String, required: true },
  qrCodeData: { type: String },
}, { timestamps: true });

export const GatePass = mongoose.model('GatePass', gatePassSchema);
