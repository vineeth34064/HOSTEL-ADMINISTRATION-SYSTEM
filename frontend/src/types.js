// --- Enums ---
export var GatePassStatus;
(function (GatePassStatus) {
    GatePassStatus["PENDING"] = "pending";
    GatePassStatus["APPROVED"] = "approved";
    GatePassStatus["OUT"] = "out";
    GatePassStatus["IN"] = "in";
    GatePassStatus["REJECTED"] = "rejected";
})(GatePassStatus || (GatePassStatus = {}));
export var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
})(RequestStatus || (RequestStatus = {}));
export var EmergencyType;
(function (EmergencyType) {
    EmergencyType["MEDICAL"] = "Medical";
    EmergencyType["FIRE"] = "Fire";
    EmergencyType["SECURITY"] = "Security";
    EmergencyType["OTHER"] = "Other";
})(EmergencyType || (EmergencyType = {}));
export var AlertStatus;
(function (AlertStatus) {
    AlertStatus["SENT"] = "sent";
    AlertStatus["ACKNOWLEDGED"] = "acknowledged";
})(AlertStatus || (AlertStatus = {}));
export var LostAndFoundStatus;
(function (LostAndFoundStatus) {
    LostAndFoundStatus["OPEN"] = "open";
    LostAndFoundStatus["CLAIMED"] = "claimed";
})(LostAndFoundStatus || (LostAndFoundStatus = {}));
