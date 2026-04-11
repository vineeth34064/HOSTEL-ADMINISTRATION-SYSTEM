import React, { useState } from "react";
import { motion } from "framer-motion";
import { EmergencyType } from "../../types";
import * as api from "../../services/api";
import Modal from "../ui/Modal";
import { AlertTriangleIcon } from "../Icons";

const typeAccent = {
  Medical: "var(--red)",
  Fire: "var(--amber)",
  Security: "#d4aa44",
  Other: "var(--accent)",
};
const typeBg = {
  Medical: "rgba(201,64,64,0.08)",
  Fire: "rgba(196,124,32,0.08)",
  Security: "rgba(184,149,46,0.08)",
  Other: "rgba(40,114,212,0.08)",
};

const EmergencyView = ({ user, alerts, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState(EmergencyType.MEDICAL);
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!description) {
      alert("Please provide a brief description.");
      return;
    }
    await api.sendEmergencyAlert(user.id, { emergencyType, description });
    refreshData();
    setIsModalOpen(false);
    setDescription("");
  };

  const activeAlerts = alerts?.filter((a) => a.status === "sent") || [];
  const resolvedAlerts = alerts?.filter((a) => a.status !== "sent") || [];

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

  const AlertCard = ({ alert }) => {
    const isOwn = alert.studentId === user.id;
    const isActive = alert.status === "sent";
    const accent = typeAccent[alert.emergencyType] || typeAccent.Other;
    const bg = typeBg[alert.emergencyType] || typeBg.Other;
    return (
      <motion.div
        variants={item}
        style={{
          background: "var(--bg)",
          border: `1px solid ${isActive ? accent : "var(--border)"}`,
          borderLeft: `4px solid ${accent}`,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: isActive ? `0 4px 18px ${accent}22` : "none",
          opacity: isActive ? 1 : 0.75,
        }}
      >
        <div
          style={{
            padding: "0.875rem 1.25rem",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangleIcon
                style={{ width: 15, height: 15, color: accent }}
              />
            </div>
            <span
              style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}
            >
              {alert.emergencyType} Emergency
            </span>
            {isOwn && <span className="hms-pill blue">Your Alert</span>}
          </div>
          <span
            className={`hms-pill ${isActive ? "red" : "green"}`}
            style={isActive ? { animation: "pulse 2s infinite" } : {}}
          >
            {isActive ? "● Active" : "✓ Resolved"}
          </span>
        </div>
        <div
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>
            {alert.description}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            <span>
              <strong style={{ color: "var(--text2)" }}>By:</strong>{" "}
              {alert.studentName} ({alert.rollNumber})
            </span>
            {alert.roomDetails && (
              <span>
                <strong style={{ color: "var(--text2)" }}>Room:</strong>{" "}
                {alert.roomDetails}
              </span>
            )}
            <span>{new Date(alert.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      style={{ maxWidth: 780 }}
    >
      {/* Banner */}
      <motion.div
        variants={item}
        style={{
          background: "linear-gradient(135deg, var(--red), #e25858)",
          borderRadius: 20,
          padding: "1.5rem 2rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 13,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangleIcon
              style={{ width: 24, height: 24, color: "#fff" }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Emergency Alert System
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.8)",
                marginTop: 2,
              }}
            >
              {activeAlerts.length > 0
                ? `⚠ ${activeAlerts.length} active alert${activeAlerts.length > 1 ? "s" : ""} on campus`
                : "All systems normal — for urgent situations only"}
            </div>
          </div>
        </div>
        <button
          className="hms-btn"
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
          }}
        >
          Send Alert
        </button>
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* Active emergencies banner */}
      {activeAlerts.length > 0 && (
        <motion.div
          variants={item}
          style={{
            background: "rgba(201,64,64,0.08)",
            border: "1px solid rgba(201,64,64,0.25)",
            borderRadius: 12,
            padding: "1rem 1.25rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <AlertTriangleIcon
            style={{
              width: 20,
              height: 20,
              color: "var(--red)",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--red)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {activeAlerts.length} Active Campus Emergency
              {activeAlerts.length > 1 ? "ies" : "y"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--red)",
                opacity: 0.8,
                marginTop: 2,
              }}
            >
              Authorities have been notified. Please remain calm and follow
              safety protocols.
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Active alerts section */}
        {activeAlerts.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--red)",
                marginBottom: "0.75rem",
              }}
            >
              ● Active — {activeAlerts.length}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {activeAlerts.map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
            </div>
          </div>
        )}

        {/* Resolved section */}
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--muted)",
              marginBottom: "0.75rem",
              paddingTop: activeAlerts.length > 0 ? "0.5rem" : 0,
              borderTop:
                activeAlerts.length > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            ✓ Resolved / History — {resolvedAlerts.length}
          </div>
          {resolvedAlerts.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {resolvedAlerts.map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                background: "var(--bg)",
                border: "2px dashed var(--border)",
                borderRadius: 14,
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              No resolved alerts. Stay safe! 🏠
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Send Emergency Alert"
      >
        <div className="hms-form-row">
          <label className="hms-label">Type of Emergency</label>
          <select
            className="hms-select"
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
          >
            {Object.values(EmergencyType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="hms-form-row">
          <label className="hms-label">Description</label>
          <textarea
            className="hms-input"
            placeholder="Briefly describe the situation…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ resize: "vertical" }}
          />
        </div>
        <button
          className="hms-btn"
          onClick={handleSubmit}
          style={{
            width: "100%",
            justifyContent: "center",
            background: "linear-gradient(135deg, var(--red), #e25858)",
            color: "#fff",
          }}
        >
          Submit Alert
        </button>
      </Modal>
    </motion.div>
  );
};

export default EmergencyView;
