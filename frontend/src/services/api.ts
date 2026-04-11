const BASE_URL = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  // Handle 204 No Content (e.g. logout) — no body to parse
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export async function login(email: string, password: string) {
  return request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string, rollNumber?: string, contactNumber?: string) {
  return request<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, rollNumber, contactNumber }),
  });
}

export async function logout() {
  return request<void>('/auth/logout', { method: 'POST' });
}

export async function getSession(): Promise<any | null> {
  try {
    return await request<any>('/auth/session');
  } catch {
    return null;
  }
}

export async function forgotPassword(email: string) {
  return request<any>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(email: string, token: string, newPassword: string) {
  return request<any>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, token, newPassword }),
  });
}

// Student
export async function getStudentParcels(studentId: string) {
  return request<any[]>(`/parcels/student/${studentId}`);
}

export async function collectParcel(parcelId: string) {
  return request<void>(`/parcels/${parcelId}/collect`, { method: 'POST' });
}

export async function getStudentData(studentId: string) {
  return request<any>(`/students/${studentId}`);
}

// Admin
export async function getAdminData() {
  return request<any>('/admin/dashboard');
}

// Gate Pass
export async function applyForGatePass(studentId: string, data: { reason: string; fromDate: string; toDate: string }) {
  return request<void>('/gatepasses', { method: 'POST', body: JSON.stringify(data) });
}

export async function approveGatePass(id: string, approve: boolean): Promise<any> {
  return request<any>(`/gatepasses/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision: approve ? 'approved' : 'rejected' }),
  });
}

export async function decideGatePass(id: string, decision: 'approved' | 'rejected') {
  return request<void>(`/gatepasses/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision }),
  });
}

// Leave
export async function applyForLeave(data: { reason: string; from: string; to: string }) {
  return request<void>('/leaves', { method: 'POST', body: JSON.stringify(data) });
}

export async function approveLeave(id: string, approve: boolean) {
  return request<void>(`/leaves/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision: approve ? 'approved' : 'rejected' }),
  });
}

export async function decideLeave(id: string, decision: 'approved' | 'rejected') {
  return request<void>(`/leaves/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision }),
  });
}

// Complaints
export async function submitComplaint(data: { subject: string; description: string }) {
  return request<void>('/complaints', { method: 'POST', body: JSON.stringify(data) });
}

export async function fileComplaint(data: { subject: string; description: string }) {
  return submitComplaint(data);
}

export async function resolveComplaint(id: string, status: string) {
  return request<void>(`/complaints/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ approve: status === 'resolved' }),
  });
}

// Emergency
export async function sendEmergencyAlert(studentId: string, data: { emergencyType: string; description: string }) {
  return request<void>('/emergencies', { method: 'POST', body: JSON.stringify(data) });
}

export async function acknowledgeEmergencyAlert(id: string) {
  return request<void>(`/emergencies/${id}/acknowledge`, { method: 'POST' });
}

export async function resolveEmergency(id: string) {
  return acknowledgeEmergencyAlert(id);
}

// Rooms
export async function getAllRooms() {
  return request<any[]>('/rooms');
}

export async function assignRoom(studentId: string, roomId: string) {
  return request<void>('/rooms/allocate', {
    method: 'POST',
    body: JSON.stringify({ studentId, roomId }),
  });
}

export async function allocateRoom(studentId: string, roomId: string) {
  return assignRoom(studentId, roomId);
}

export async function unassignRoom(studentId: string, roomId: string) {
  return request<void>(`/rooms/${roomId}/unassign`, {
    method: 'POST',
    body: JSON.stringify({ studentId }),
  });
}

// Parcels
export async function addParcel(data: { studentId: string; courier: string; trackingId?: string }) {
  return request<void>('/parcels', { method: 'POST', body: JSON.stringify(data) });
}

export async function markParcelPickedUp(id: string) {
  return request<void>(`/parcels/${id}/collect`, { method: 'POST' });
}

// Mess Menu
export async function updateMessMenu(data: { day: string; breakfast: string; lunch: string; dinner: string }) {
  // Backend expects an array of menu items in { menu: [...] }
  return request<void>('/mess-menu', { 
    method: 'PUT', 
    body: JSON.stringify({ menu: [data] }) 
  });
}

// Fees
export async function markFeePaid(studentId: string) {
  return request<void>(`/fees/${studentId}/toggle`, { method: 'POST' });
}

export async function manuallyUpdateFeeStatus(studentId: string) {
  return markFeePaid(studentId);
}

// Lost & Found
export async function postLostAndFoundItem(studentId: string, data: { itemType: string; description: string; location: string }) {
  return request<void>('/lost-found', { method: 'POST', body: JSON.stringify(data) });
}

export async function claimLostAndFoundItem(id: string) {
  return request<void>(`/lost-found/${id}/claim`, { method: 'POST' });
}

export async function resolveLostFound(id: string) {
  return request<void>(`/lost-found/${id}/resolve`, { method: 'POST' });
}

export async function deleteLostAndFoundItem(id: string) {
  return request<void>(`/lost-found/${id}`, { method: 'DELETE' });
}

// Notifications
export async function sendNotification(data: { message: string; recipientRole?: string }) {
  return request<void>('/notifications', { method: 'POST', body: JSON.stringify(data) });
}

export async function createNotification(data: { title: string; message: string; category?: string; link?: string }) {
  return request<void>('/notifications', { method: 'POST', body: JSON.stringify(data) });
}

export async function getNotifications() {
  return request<any[]>('/notifications');
}

export async function markNotificationsRead() {
  return request<void>('/notifications/read', { method: 'POST' });
}

// Chat
export async function searchUsers(query: string) {
  return request<any[]>(`/chat/search?query=${encodeURIComponent(query)}`);
}

export async function getRecentChats() {
  return request<any[]>('/chat/recent');
}

export async function getChatMessages(userId: string) {
  return request<any[]>(`/chat/${userId}`);
}

export async function sendChatMessage(receiver: string, content: string) {
  return request<any>('/chat', {
    method: 'POST',
    body: JSON.stringify({ receiver, content }),
  });
}

// Anti-Ragging
export async function submitAntiRaggingComplaint(data: { accusedName: string; incidentLocation: string; description: string }) {
  return request<any>('/antiragging', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getAntiRaggingComplaints() {
  return request<any[]>('/antiragging');
}

export async function updateAntiRaggingComplaint(id: string, data: { status?: string; adminNotes?: string }) {
  return request<any>(`/antiragging/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// AI Chatbot
export async function sendAIChatbotMessage(message: string, previousState: string, contextData: any = null) {
  return request<any>('/chatbot', {
    method: 'POST',
    body: JSON.stringify({ message, previousState, contextData })
  });
}

// Health Records
export async function getMyHealthRecord() {
  return request<any>('/health/my');
}

export async function getStudentHealthRecord(studentId: string) {
  return request<any>(`/health/${studentId}`);
}

export async function getAllHealthRecords() {
  return request<any[]>('/health');
}
