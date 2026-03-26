// --- Enums ---

export enum GatePassStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  OUT = 'out',
  IN = 'in',
  REJECTED = 'rejected',
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum EmergencyType {
  MEDICAL = 'Medical',
  FIRE = 'Fire',
  SECURITY = 'Security',
  OTHER = 'Other',
}

export enum AlertStatus {
  SENT = 'sent',
  ACKNOWLEDGED = 'acknowledged',
}

export enum LostAndFoundStatus {
  OPEN = 'open',
  CLAIMED = 'claimed',
}

// --- Interfaces ---

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  rollNumber?: string;
  room?: string | Room;
  feePaid?: boolean;
  contactNumber?: string;
  guardian?: {
    name: string;
    contactNumber: string;
  };
  createdAt?: string;
}

export interface Room {
  _id: string;
  id: string;
  block: string;
  roomNumber: string;
  number?: string;
  capacity: number;
  occupants: (User | string)[];
}

export interface GatePass {
  _id?: string;
  id: string;
  studentName: string;
  rollNumber: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: GatePassStatus | string;
  approvalQrCodeData: string;
  qrCodeData?: string;
  createdAt?: string;
}

export interface LeaveRequest {
  _id?: string;
  id: string;
  studentName: string;
  rollNumber: string;
  reason: string;
  fromDate: string;
  toDate: string;
  from?: string;
  to?: string;
  status: RequestStatus | string;
  createdAt?: string;
}

export interface Complaint {
  _id?: string;
  id: string;
  studentName: string;
  rollNumber?: string;
  subject: string;
  description: string;
  status: RequestStatus | string;
  createdAt?: string;
}

export interface AntiRaggingComplaint {
  _id?: string;
  id: string;
  victim?: string;
  victimName: string;
  victimRollNumber?: string;
  accusedName: string;
  incidentLocation: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | string;
  adminNotes?: string;
  dateReported?: string;
}

export interface EmergencyAlert {
  _id?: string;
  id: string;
  studentName: string;
  rollNumber: string;
  roomDetails: string;
  emergencyType: EmergencyType | string;
  description: string;
  status: AlertStatus | string;
  timestamp: string;
}

export interface Parcel {
  _id?: string;
  id: string;
  studentName: string;
  rollNumber?: string;
  description: string;
  courier?: string;
  trackingId?: string;
  receivedAt?: string;
  pickedUp: boolean;
  collected?: boolean; // Aliasing pickedUp if needed for consistency
}

export interface MessMenuItem {
  _id?: string;
  id?: string;
  day: string;
  breakfast: string;
  lunch: string;
  snacks?: string;
  dinner: string;
}

export interface LostAndFoundItem {
  _id?: string;
  id: string;
  studentId: string;
  studentName: string;
  itemType: 'lost' | 'found';
  description: string;
  location: string;
  status: LostAndFoundStatus | string;
  datePosted: string;
}

export interface Notification {
  _id?: string;
  id?: string;
  title?: string;
  message: string;
  category?: 'general' | 'sports';
  link?: string;
  read?: boolean;
  createdAt?: string;
}

export interface AdminDashboardAnalytics {
  totalStudents: number;
  studentsOnLeave: number;
  studentsOut: number;
  pendingComplaints: number;
  parcelsToCollect: number;
  feesPaid: number;
  feesPending: number;
  pendingEmergencies: number;
  leaveRequestsOverTime: { date: string; count: number }[];
}

export interface StudentData {
  user: User;
  room?: Room;
  gatePass?: GatePass | null;
  leaves: LeaveRequest[];
  complaints: Complaint[];
  messMenu: MessMenuItem[];
  parcels: Parcel[];
  emergencyAlerts: EmergencyAlert[];
  lostAndFoundItems: LostAndFoundItem[];
  notifications: Notification[];
}

export interface AdminData {
  analytics: AdminDashboardAnalytics;
  students: User[];
  rooms: Room[];
  gatePassRequests: GatePass[];
  leaveRequests: LeaveRequest[];
  complaints: Complaint[];
  messMenu: MessMenuItem[];
  parcels: Parcel[];
  emergencyAlerts: EmergencyAlert[];
  lostAndFoundItems: LostAndFoundItem[];
}

export interface HealthRecord {
  _id?: string;
  student: string | User;
  studentName: string;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  allergies: string[];
  existingMedicalConditions: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  doctorDetails: {
    name: string;
    hospital: string;
    phone: string;
  };
  vaccinationRecords: {
    vaccineName: string;
    dateAdministered: string;
  }[];
  recentIllnesses: string[];
  medicalHistory: string;
  disabilityInfo: string;
  healthInsuranceDetails: {
    providerName: string;
    policyNumber: string;
  };
  lastMedicalCheckup: string;
}
