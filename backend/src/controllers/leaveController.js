import { LeaveRequest } from '../models/LeaveRequest.js';
import { User } from '../models/User.js';

export async function applyForLeave(req, res) {
  try {
    const { reason, from, to } = req.body;
    // Get student ID from authenticated user
    const studentId = req.user._id.toString();
    
    if (!reason || !from || !to) {
      return res.status(400).send('Missing required fields: reason, from, to');
    }
    
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    
    const leave = await LeaveRequest.create({
      student: student._id,
      studentName: student.name,
      rollNumber: student.rollNumber || '',
      reason,
      fromDate: new Date(from),
      toDate: new Date(to),
    });
    res.status(201).json(mapLeave(leave));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to apply for leave');
  }
}

export async function decideLeave(req, res) {
  try {
    const { id } = req.params;
    const { approve } = req.body;
    const leave = await LeaveRequest.findById(id);
    if (!leave) {
      return res.status(404).send('Leave request not found');
    }
    leave.status = approve ? 'approved' : 'rejected';
    await leave.save();
    res.json(mapLeave(leave));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update leave request');
  }
}

function mapLeave(l) {
  return {
    id: l._id.toString(),
    studentId: l.student.toString(),
    studentName: l.studentName,
    rollNumber: l.rollNumber,
    reason: l.reason,
    status: l.status,
    requestDate: l.requestDate,
  };
}
