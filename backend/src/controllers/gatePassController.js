import { GatePass } from '../models/GatePass.js'; 
import { User } from '../models/User.js';

export async function applyForGatePass(req, res) {
  try {
    const { reason, fromDate, toDate } = req.body;
    // Get student ID from authenticated user
    const studentId = req.user._id.toString();
    
    if (!reason || !fromDate || !toDate) {
      return res.status(400).send('Missing required fields: reason, fromDate, toDate');
    }
    
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    
    const approvalQrCodeData = `${student._id.toString()}-${Date.now()}`;
    const gatePass = await GatePass.create({
      student: student._id,
      studentName: student.name,
      rollNumber: student.rollNumber || '',
      reason,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      approvalQrCodeData,
    });
    res.status(201).json(mapGatePass(gatePass));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to apply for gate pass');
  }
}

export async function decideGatePass(req, res) {
  try {
    const { id } = req.params;
    const { approve, decision } = req.body;
    const isApproved = approve === true || String(approve) === 'true' || decision === 'approved';
    
    const gatePass = await GatePass.findById(id);
    if (!gatePass) {
      return res.status(404).send('Gate pass not found');
    }
    gatePass.status = isApproved ? 'approved' : 'rejected';
    if (isApproved) {
      gatePass.qrCodeData = `${gatePass._id.toString()}-qr-${Date.now()}`;
    }
    await gatePass.save();
    res.json(mapGatePass(gatePass));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update gate pass');
  }
}

function mapGatePass(g) {
  return {
    id: g._id.toString(),
    studentId: g.student.toString(),
    studentName: g.studentName,
    rollNumber: g.rollNumber,
    reason: g.reason,
    fromDate: g.fromDate,
    toDate: g.toDate,
    status: g.status,
    approvalQrCodeData: g.approvalQrCodeData,
    qrCodeData: g.qrCodeData,
  };
}
