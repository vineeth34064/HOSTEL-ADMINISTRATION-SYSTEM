import { User } from '../models/User.js';
import { Room } from '../models/Room.js';
import { GatePass } from '../models/GatePass.js';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { Complaint } from '../models/Complaint.js';
import { Parcel } from '../models/Parcel.js';
import { MessMenuItem } from '../models/MessMenuItem.js';
import { EmergencyAlert } from '../models/EmergencyAlert.js';
import { LostAndFoundItem } from '../models/LostAndFoundItem.js';

async function ensureInitialRoomsAndMenu() {
  const roomCount = await Room.countDocuments();
  if (roomCount === 0) {
    const roomsToCreate = [];
    const wings = ['A', 'B'];
    for (const wing of wings) {
      for (let i = 1; i <= 20; i++) {
        const floor = 1; // simple example: all on first floor
        const roomNo = i.toString().padStart(2, '0');
        const roomNumber = `${floor}${roomNo}`; // e.g. 115
        roomsToCreate.push({
          roomNumber,
          block: wing,
          capacity: 3,
          occupants: [],
        });
      }
    }
    await Room.insertMany(roomsToCreate);
  }

  const menuCount = await MessMenuItem.countDocuments();
  if (menuCount === 0) {
    const menu = [
      {
        day: 'Monday',
        breakfast: 'Idli, Vada, Groundnut Chutney, Sambar, Banana/Boiled Egg, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Bhatura, Chola Masala, Tomato Drumstick Curry, Bhindi + Peanut Fry, Rice, Rasam, Mango Pickle, Homemade Curd, Veg Salad + Lemon Juice, Fryums Papad',
        snacks: 'Onion Pakoda, Tea/Coffee with Milk',
        dinner: 'White Rice + Tomato Fried Rice, Aloo Jhor, Sambar, Paratha, Curd (1 Cup), Jalebi (2)',
      },
      {
        day: 'Tuesday',
        breakfast: 'Poori, Poha, Coconut Chutney, Aloo Sabji, Boiled Egg/Banana, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Roti, Mixed Dal, Kadhi Pakoda, Aloo Fry, Rice, Sambar, Lemon Pickle, Homemade Curd, Veg Salad + Lassi, Priya Papad',
        snacks: 'Samosa (1 piece big) + Tomato Ketchup, Tea/Coffee with Milk',
        dinner: 'White Rice + Khichdi, Rajma Masala, Sambar, Paratha, Curd (1 Cup), Balushahi (1)',
      },
      {
        day: 'Wednesday',
        breakfast: 'Onion Uttappam, Mixed Fruits, Groundnut Chutney, Sambar, Banana/Boiled Egg, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Chapathi, Mixed Dal, Sesona Vegetable Curry, Beans Fry, Rice, Rasam, Amla Pickle, Homemade Curd, Veg Salad + Lemon Juice, Fryums Papad',
        snacks: 'Dal Kachori (1) with Green Chutney, Tea/Coffee with Milk',
        dinner: 'White Rice + Veg Pulao, Matar Paneer/Chicken Curry (150 gms), Sambar, Paratha, Curd + Veg Salad, Amul Ice Cream (1 cup)',
      },
      {
        day: 'Thursday',
        breakfast: 'Plain Paratha, Uggani, Aloo Bhoojia, Boiled Egg/Banana, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Methi Puri, Fry Toor (Arhar) Dal, Aloo Jeera, Onion Pakoda, Rice, Sambar, Chilli Pickle, Homemade Curd, Veg Salad + Pineapple Juice, Priya Papad',
        snacks: 'Punugulu (6 pieces) with Chutney, Tea/Coffee with Milk',
        dinner: 'White Rice + Tamarind Rice, Sev Tomato, Arhar Dal, Roti, Curd (1 Cup), Fruit Custard',
      },
      {
        day: 'Friday',
        breakfast: 'Idli, Vada, Coconut Chutney, Sambar, Boiled Egg/Banana, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Roti, Plain Dal, Egg Onion Curry + Matar Paneer Curry, Aloo Pakoda, Rice, Rasam, Gongura Chutney, Homemade Curd, Veg Salad + Lemon Juice, Fryums Papad',
        snacks: 'Vada (2 pieces), Pav (4 pieces), Tea/Coffee with Milk',
        dinner: 'White Rice + Paneer Fried Rice, Mix Veg Curry, Sambar, Roti, Veg Raita, Gulab Jamun (2 big)',
      },
      {
        day: 'Saturday',
        breakfast: 'Masala Dosa, Tomato Bath, Coconut Chutney (thick), Sambar, Banana/Boiled Egg, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Roti, Tehri, Aloo Torai, Round Aloo Bhaji, Rice, Rasam, Onion Chutney, Homemade Curd, Veg Salad + Rasna, Priya Papad',
        snacks: 'Pani Puri (6 pieces), Tea/Coffee with Milk',
        dinner: 'White Rice + Fried Rice, Kabuli Chana, Coriander Chutney/Tomato Chutney, Chapathi, Curd (1 Cup), Gulab Jamun (2 big)',
      },
      {
        day: 'Sunday',
        breakfast: 'Aloo Paratha, Poha, Tomato Chutney, Mango Pickle, Curd, Banana/Boiled Egg, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Chapathi, Fry Toor Dal/Arhar Dal, Rajma Masala, Bombay Mixture, Rice, Sambar, Tomato Pickle, Homemade Curd, Veg Salad + Lemon Juice, Priya Papad',
        snacks: 'Samosa, Tea/Coffee with Milk',
        dinner: 'Chicken Dum Biryani/Kadai Paneer + Jeera Rice, Sevai, Veg Raita, Paratha, Veg Salad, Cold Drink',
      },
    ];
    await MessMenuItem.insertMany(menu);
  }
}

export async function getAdminDashboard(req, res) {
  try {
    await ensureInitialRoomsAndMenu();

    const students = await User.find({ role: 'student' });
    const rooms = await Room.find({});
    const gatePassRequests = await GatePass.find({}).sort({ createdAt: -1 });
    const leaveRequests = await LeaveRequest.find({}).sort({ createdAt: -1 });
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    const parcels = await Parcel.find({}).sort({ createdAt: -1 });
    const messMenu = await MessMenuItem.find({}).sort({ day: 1 });
    const emergencyAlerts = await EmergencyAlert.find({}).sort({ createdAt: -1 });
    const lostAndFoundItems = await LostAndFoundItem.find({}).sort({ createdAt: -1 });

    const totalStudents = students.length;
    const studentsOnLeave = await LeaveRequest.countDocuments({ status: 'approved' });
    const studentsOut = await GatePass.countDocuments({ status: { $in: ['approved', 'out'] } });
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const feesPaid = students.filter(s => s.feePaid).length;
    const feesPending = totalStudents - feesPaid;

    const leaveRequestsOverTime = await LeaveRequest.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$requestDate' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      analytics: {
        totalStudents,
        studentsOnLeave,
        studentsOut,
        pendingComplaints,
        feesPending,
        feesPaid,
        parcelsToCollect: await Parcel.countDocuments({ collected: false }),
        pendingEmergencies: await EmergencyAlert.countDocuments({ status: 'Sent' }),
        leaveRequestsOverTime: leaveRequestsOverTime.map(item => ({ date: item._id, count: item.count })),
      },
      students: students.map(mapUser),
      rooms: rooms.map(mapRoom),
      gatePassRequests: gatePassRequests.map(mapGatePass),
      leaveRequests: leaveRequests.map(mapLeave),
      complaints: complaints.map(mapComplaint),
      parcels: parcels.map(mapParcel),
      messMenu: messMenu.map(mapMenu),
      emergencyAlerts: emergencyAlerts.map(mapEmergency),
      lostAndFoundItems: lostAndFoundItems.map(mapLostAndFound),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load admin data');
  }
}

function mapUser(u) {
  return {
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    passwordHash: u.passwordHash,
    role: u.role,
    rollNumber: u.rollNumber,
    feePaid: u.feePaid,
  };
}

function mapRoom(r) {
  return {
    id: r._id.toString(),
    roomNumber: r.roomNumber,
    block: r.block,
    capacity: r.capacity,
    occupants: r.occupants.map(o => o.toString()),
  };
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

function mapMenu(m) {
  return {
    day: m.day,
    breakfast: m.breakfast,
    lunch: m.lunch,
    snacks: m.snacks,
    dinner: m.dinner,
  };
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

function mapLostAndFound(l) {
  return {
    id: l._id.toString(),
    studentId: l.student.toString(),
    studentName: l.studentName,
    itemType: l.itemType,
    description: l.description,
    location: l.location,
    datePosted: l.datePosted,
    status: l.status,
  };
}
