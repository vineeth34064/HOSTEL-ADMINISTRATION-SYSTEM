import { EmergencyAlert } from '../models/EmergencyAlert.js';
import { User } from '../models/User.js';
import { Room } from '../models/Room.js';

export async function sendEmergencyAlert(req, res) {
  try {
    const { emergencyType, description } = req.body;
    // Get student ID from authenticated user
    const studentId = req.user._id.toString();
    
    if (!emergencyType || !description) {
      return res.status(400).send('Missing required fields: emergencyType, description');
    }
    
    const student = await User.findById(studentId).populate('room');
    if (!student) {
      return res.status(404).send('Student not found');
    }
    
    let roomDetails = '';
    if (student.room) {
      const room = await Room.findById(student.room);
      if (room) {
        roomDetails = `${room.block}-${room.roomNumber}`;
      }
    }
    
    const alert = await EmergencyAlert.create({
      student: student._id,
      studentName: student.name,
      rollNumber: student.rollNumber || '',
      roomDetails,
      emergencyType,
      description,
    });
    res.status(201).json(mapEmergency(alert));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send emergency alert');
  }
}

export async function acknowledgeEmergencyAlert(req, res) {
  try {
    const { id } = req.params;
    const alert = await EmergencyAlert.findById(id);
    if (!alert) {
      return res.status(404).send('Alert not found');
    }
    alert.status = 'acknowledged';
    await alert.save();
    res.json(mapEmergency(alert));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to acknowledge alert');
  }
}

function mapEmergency(e) {
  return {
    id: e._id.toString(),
    studentId: e.student.toString(),
    studentName: e.studentName,
    rollNumber: e.rollNumber,
    roomDetails: e.roomDetails,
    emergencyType: e.emergencyType,
    description: e.description,
    timestamp: e.timestamp,
    status: e.status,
  };
}
