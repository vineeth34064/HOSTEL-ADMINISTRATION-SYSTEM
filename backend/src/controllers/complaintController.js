import { Complaint } from '../models/Complaint.js';
import { User } from '../models/User.js';

export async function fileComplaint(req, res) {
  try {
    const { subject, description } = req.body;
    // Get student ID from authenticated user
    const studentId = req.user._id.toString();
    
    if (!description) {
      return res.status(400).send('Missing description');
    }
    
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    
    const complaint = await Complaint.create({
      student: student._id,
      studentName: student.name,
      rollNumber: student.rollNumber || '',
      subject: subject || 'General Complaint',
      description,
    });
    res.status(201).json(mapComplaint(complaint));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to file complaint');
  }
}

export async function decideComplaint(req, res) {
  try {
    const { id } = req.params;
    const { approve } = req.body;
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).send('Complaint not found');
    }
    complaint.status = approve ? 'approved' : 'rejected';
    await complaint.save();
    res.json(mapComplaint(complaint));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update complaint');
  }
}

function mapComplaint(c) {
  return {
    id: c._id.toString(),
    studentId: c.student.toString(),
    studentName: c.studentName,
    rollNumber: c.rollNumber,
    description: c.description,
    status: c.status,
  };
}
