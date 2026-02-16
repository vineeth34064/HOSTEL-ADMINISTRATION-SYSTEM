import { Parcel } from '../models/Parcel.js';
import { User } from '../models/User.js';

export async function getStudentParcels(req, res) {
  try {
    const { studentId } = req.params;
    const parcels = await Parcel.find({ student: studentId });
    res.json(parcels.map(mapParcel));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch parcels');
  }
}

export async function addParcel(req, res) {
  try {
    const { studentId, courier, trackingId } = req.body;
    if (!studentId || !courier) {
      return res.status(400).send('Missing studentId or courier');
    }
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    const parcel = await Parcel.create({
      student: student._id,
      studentName: student.name,
      rollNumber: student.rollNumber || '',
      courier,
      trackingId,
    });
    res.status(201).json(mapParcel(parcel));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add parcel');
  }
}

export async function collectParcel(req, res) {
  try {
    const { id } = req.params;
    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return res.status(404).send('Parcel not found');
    }
    parcel.collected = true;
    await parcel.save();
    res.json(mapParcel(parcel));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to collect parcel');
  }
}

function mapParcel(p) {
  return {
    id: p._id.toString(),
    studentId: p.student.toString(),
    studentName: p.studentName,
    rollNumber: p.rollNumber,
    courier: p.courier,
    trackingId: p.trackingId,
    receivedDate: p.receivedDate,
    collected: p.collected,
  };
}
