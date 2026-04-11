// --- Enums ---

export let GatePassStatus = /*#__PURE__*/ (function (GatePassStatus) {
  GatePassStatus["PENDING"] = "pending";
  GatePassStatus["APPROVED"] = "approved";
  GatePassStatus["OUT"] = "out";
  GatePassStatus["IN"] = "in";
  GatePassStatus["REJECTED"] = "rejected";
  return GatePassStatus;
})({});

export let RequestStatus = /*#__PURE__*/ (function (RequestStatus) {
  RequestStatus["PENDING"] = "pending";
  RequestStatus["APPROVED"] = "approved";
  RequestStatus["REJECTED"] = "rejected";
  return RequestStatus;
})({});

export let EmergencyType = /*#__PURE__*/ (function (EmergencyType) {
  EmergencyType["MEDICAL"] = "Medical";
  EmergencyType["FIRE"] = "Fire";
  EmergencyType["SECURITY"] = "Security";
  EmergencyType["OTHER"] = "Other";
  return EmergencyType;
})({});

export let AlertStatus = /*#__PURE__*/ (function (AlertStatus) {
  AlertStatus["SENT"] = "sent";
  AlertStatus["ACKNOWLEDGED"] = "acknowledged";
  return AlertStatus;
})({});

export let LostAndFoundStatus = /*#__PURE__*/ (function (LostAndFoundStatus) {
  LostAndFoundStatus["OPEN"] = "open";
  LostAndFoundStatus["CLAIMED"] = "claimed";
  return LostAndFoundStatus;
})({});

// --- Interfaces ---
