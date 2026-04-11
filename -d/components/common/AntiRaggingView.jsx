import React, { useState } from "react";
import { motion } from "framer-motion";
import * as api from "../../services/api";
import Modal from "../ui/Modal";
import { ShieldIcon } from "../Icons";
import { useEffect } from "react";

const statusStyle = {
  resolved: "green",
  investigating: "gold",
  pending: "red",
};

const AntiRaggingView = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const [accusedName, setAccusedName] = useState("");
  const [incidentLocation, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("investigating");

  const isAdmin = user.role === "admin";

  const load = async () => {
    try {
      setComplaints(await api.getAntiRaggingComplaints());
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!accusedName || !incidentLocation || !description) {
      alert("Please fill all fields.");
      return;
    }
    if (
      confirm(
        "Submit this formal complaint? False reports have strict consequences.",
      )
    ) {
      await api.submitAntiRaggingComplaint({
        accusedName,
        incidentLocation,
        description,
      });
      setAccusedName("");
      setLocation("");
      setDescription("");
      await load();
      setIsModalOpen(false);
    }
  };
  const handleResolve = async (id) => {
    await api.updateAntiRaggingComplaint(id, {
      status: statusUpdate,
      adminNotes,
    });
    setResolvingId(null);
    setAdminNotes("");
    await load();
  };

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      style={{ maxWidth: 860 }}
    >
      {/* Banner */}
      <motion.div
        variants={item}
        style={{
          background: "linear-gradient(135deg, #b91c1c, #dc2626)",
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
            <ShieldIcon style={{ width: 26, height: 26, color: "#fff" }} />
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
              Anti-Ragging Squad
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.8)",
                marginTop: 2,
              }}
            >
              Zero tolerance · Secure &amp; confidential reporting
            </div>
          </div>
        </div>
        {!isAdmin && (
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
            Report Incident
          </button>
        )}
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

      {/* Section heading */}
      <motion.div
        variants={item}
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "0.875rem",
        }}
      >
        {isAdmin ? "All Submitted Reports" : "My Past Reports"} (
        {complaints.length})
      </motion.div>

      {/* Complaints list */}
      {complaints.length === 0 ? (
        <motion.div
          variants={item}
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
            background: "var(--bg)",
            border: "2px dashed var(--border)",
            borderRadius: 14,
            color: "var(--muted)",
            fontSize: 13,
          }}
        >
          No anti-ragging reports on file.
        </motion.div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {complaints.map((c) => {
            const id = c._id || c.id;
            return (
              <motion.div
                key={id}
                variants={item}
                style={{
                  background: "var(--bg)",
                  border: `1px solid ${c.status === "pending" ? "rgba(201,64,64,0.3)" : "var(--border)"}`,
                  borderLeft: `4px solid ${c.status === "resolved" ? "var(--green)" : c.status === "investigating" ? "var(--amber)" : "var(--red)"}`,
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    padding: "0.875rem 1.25rem",
                    borderBottom: "1px solid var(--border)",
                    background: "var(--bg2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      className={`hms-pill ${statusStyle[c.status] || "gray"}`}
                    >
                      {c.status}
                    </span>
                    {isAdmin && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--accent)",
                          fontWeight: 500,
                        }}
                      >
                        by {c.victimName} ({c.victimRollNumber})
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    {new Date(c.dateReported).toLocaleString()}
                  </span>
                </div>

                {/* Card body */}
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minWidth: 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.625rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--muted)",
                          marginBottom: 3,
                        }}
                      >
                        Accused
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {c.accusedName}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--muted)",
                          marginBottom: 3,
                        }}
                      >
                        Location
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text2)" }}>
                        {c.incidentLocation}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--bg2)",
                        borderRadius: 8,
                        padding: "0.75rem",
                        fontSize: 13,
                        color: "var(--text2)",
                        fontStyle: "italic",
                        lineHeight: 1.6,
                      }}
                    >
                      "{c.description}"
                    </div>
                    {c.adminNotes && (
                      <div
                        style={{
                          background: "rgba(40,114,212,0.08)",
                          border: "1px solid rgba(40,114,212,0.2)",
                          borderRadius: 8,
                          padding: "0.75rem",
                          fontSize: 12,
                          color: "var(--accent)",
                        }}
                      >
                        <strong>Admin Notes:</strong> {c.adminNotes}
                      </div>
                    )}
                  </div>

                  {/* Admin action */}
                  {isAdmin && c.status !== "resolved" && (
                    <div style={{ width: 230, flexShrink: 0 }}>
                      {resolvingId === id ? (
                        <div
                          style={{
                            background: "var(--bg2)",
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            padding: "0.875rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                          }}
                        >
                          <label className="hms-label">Update Status</label>
                          <select
                            className="hms-select"
                            value={statusUpdate}
                            onChange={(e) => setStatusUpdate(e.target.value)}
                          >
                            <option value="investigating">
                              Under Investigation
                            </option>
                            <option value="resolved">Resolved / Closed</option>
                          </select>
                          <textarea
                            className="hms-input"
                            placeholder="Admin action taken…"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={2}
                            style={{ resize: "none" }}
                          />
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              className="hms-btn hms-btn-primary"
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                fontSize: 12,
                              }}
                              onClick={() => handleResolve(id)}
                            >
                              Save
                            </button>
                            <button
                              className="hms-btn hms-btn-outline"
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                fontSize: 12,
                              }}
                              onClick={() => setResolvingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="hms-btn hms-btn-outline"
                          style={{ width: "100%", justifyContent: "center" }}
                          onClick={() => {
                            setResolvingId(id);
                            setStatusUpdate(
                              c.status === "pending"
                                ? "investigating"
                                : "resolved",
                            );
                          }}
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Submit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report an Incident"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div className="hms-form-row">
            <label className="hms-label">Name of Accused</label>
            <input
              className="hms-input"
              placeholder="Who was involved?"
              value={accusedName}
              onChange={(e) => setAccusedName(e.target.value)}
            />
          </div>
          <div className="hms-form-row">
            <label className="hms-label">Location</label>
            <input
              className="hms-input"
              placeholder="Where did it happen?"
              value={incidentLocation}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="hms-form-row">
          <label className="hms-label">Detailed Description</label>
          <textarea
            className="hms-input"
            placeholder="Describe the incident securely…"
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
            background: "linear-gradient(135deg, #b91c1c, #dc2626)",
            color: "#fff",
          }}
        >
          Submit Confidential Report
        </button>
      </Modal>
    </motion.div>
  );
};

export default AntiRaggingView;
