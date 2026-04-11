const BASE_URL = "/api";

async function request(url, options) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  // Handle 204 No Content (e.g. logout) — no body to parse
  if (res.status === 204) return undefined;
  return res.json();
}

// Auth
export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  name,
  email,
  password,
  rollNumber,
  contactNumber,
) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, rollNumber, contactNumber }),
  });
}

export async function logout() {
  return request("/auth/logout", { method: "POST" });
}

export async function getSession() {
  try {
    return await request("/auth/session");
  } catch {
    return null;
  }
}

export async function forgotPassword(email) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(email, token, newPassword) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, token, newPassword }),
  });
}

// Student
export async function getStudentParcels(studentId) {
  return request(`/parcels/student/${studentId}`);
}

export async function collectParcel(parcelId) {
  return request(`/parcels/${parcelId}/collect`, { method: "POST" });
}

export async function getStudentData(studentId) {
  return request(`/students/${studentId}`);
}

// Admin
export async function getAdminData() {
  return request("/admin/dashboard");
}

// Gate Pass
export async function applyForGatePass(studentId, data) {
  return request("/gatepasses", { method: "POST", body: JSON.stringify(data) });
}

export async function approveGatePass(id, approve) {
  return request(`/gatepasses/${id}/decision`, {
    method: "POST",
    body: JSON.stringify({ decision: approve ? "approved" : "rejected" }),
  });
}

export async function decideGatePass(id, decision) {
  return request(`/gatepasses/${id}/decision`, {
    method: "POST",
    body: JSON.stringify({ decision }),
  });
}

// Leave
export async function applyForLeave(data) {
  return request("/leaves", { method: "POST", body: JSON.stringify(data) });
}

export async function approveLeave(id, approve) {
  return request(`/leaves/${id}/decision`, {
    method: "POST",
    body: JSON.stringify({ decision: approve ? "approved" : "rejected" }),
  });
}

export async function decideLeave(id, decision) {
  return request(`/leaves/${id}/decision`, {
    method: "POST",
    body: JSON.stringify({ decision }),
  });
}

// Complaints
export async function submitComplaint(data) {
  return request("/complaints", { method: "POST", body: JSON.stringify(data) });
}

export async function fileComplaint(data) {
  return submitComplaint(data);
}

export async function resolveComplaint(id, status) {
  return request(`/complaints/${id}/decision`, {
    method: "POST",
    body: JSON.stringify({ approve: status === "resolved" }),
  });
}

// Emergency
export async function sendEmergencyAlert(studentId, data) {
  return request("/emergencies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function acknowledgeEmergencyAlert(id) {
  return request(`/emergencies/${id}/acknowledge`, { method: "POST" });
}

export async function resolveEmergency(id) {
  return acknowledgeEmergencyAlert(id);
}

// Rooms
export async function getAllRooms() {
  return request("/rooms");
}

export async function assignRoom(studentId, roomId) {
  return request("/rooms/allocate", {
    method: "POST",
    body: JSON.stringify({ studentId, roomId }),
  });
}

export async function allocateRoom(studentId, roomId) {
  return assignRoom(studentId, roomId);
}

export async function unassignRoom(studentId, roomId) {
  return request(`/rooms/${roomId}/unassign`, {
    method: "POST",
    body: JSON.stringify({ studentId }),
  });
}

// Parcels
export async function addParcel(data) {
  return request("/parcels", { method: "POST", body: JSON.stringify(data) });
}

export async function markParcelPickedUp(id) {
  return request(`/parcels/${id}/collect`, { method: "POST" });
}

// Mess Menu
export async function updateMessMenu(data) {
  // Backend expects an array of menu items in { menu: [...] }
  return request("/mess-menu", {
    method: "PUT",
    body: JSON.stringify({ menu: [data] }),
  });
}

// Fees
export async function markFeePaid(studentId) {
  return request(`/fees/${studentId}/toggle`, { method: "POST" });
}

export async function manuallyUpdateFeeStatus(studentId) {
  return markFeePaid(studentId);
}

// Lost & Found
export async function postLostAndFoundItem(studentId, data) {
  return request("/lost-found", { method: "POST", body: JSON.stringify(data) });
}

export async function claimLostAndFoundItem(id) {
  return request(`/lost-found/${id}/claim`, { method: "POST" });
}

export async function resolveLostFound(id) {
  return request(`/lost-found/${id}/resolve`, { method: "POST" });
}

export async function deleteLostAndFoundItem(id) {
  return request(`/lost-found/${id}`, { method: "DELETE" });
}

// Notifications
export async function sendNotification(data) {
  return request("/notifications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createNotification(data) {
  return request("/notifications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getNotifications() {
  return request("/notifications");
}

export async function markNotificationsRead() {
  return request("/notifications/read", { method: "POST" });
}

// Chat
export async function searchUsers(query) {
  return request(`/chat/search?query=${encodeURIComponent(query)}`);
}

export async function getRecentChats() {
  return request("/chat/recent");
}

export async function getChatMessages(userId) {
  return request(`/chat/${userId}`);
}

export async function sendChatMessage(receiver, content) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ receiver, content }),
  });
}

// Anti-Ragging
export async function submitAntiRaggingComplaint(data) {
  return request("/antiragging", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAntiRaggingComplaints() {
  return request("/antiragging");
}

export async function updateAntiRaggingComplaint(id, data) {
  return request(`/antiragging/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// AI Chatbot
export async function sendAIChatbotMessage(
  message,
  previousState,
  contextData = null,
) {
  return request("/chatbot", {
    method: "POST",
    body: JSON.stringify({ message, previousState, contextData }),
  });
}

// Health Records
export async function getMyHealthRecord() {
  return request("/health/my");
}

export async function getStudentHealthRecord(studentId) {
  return request(`/health/${studentId}`);
}

export async function getAllHealthRecords() {
  return request("/health");
}
