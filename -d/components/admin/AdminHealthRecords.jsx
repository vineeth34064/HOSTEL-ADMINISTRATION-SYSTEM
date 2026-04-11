import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import * as api from "../../services/api";
import { SearchIcon, ActivityIcon, PhoneIcon } from "../Icons";

export default function AdminHealthRecords() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      setRecords(await api.getAllHealthRecords());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = records.filter(
    (r) =>
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      (typeof r.student === "object" &&
        "rollNumber" in r.student &&
        r.student.rollNumber?.toLowerCase().includes(search.toLowerCase())) ||
      r.bloodGroup.toLowerCase().includes(search.toLowerCase()),
  );

  const InfoSection = ({ label, children }) => (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--muted)",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
  const InfoBlock = ({ children }) => (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "0.875rem",
      }}
    >
      {children}
    </div>
  );
  const InfoRow = ({ label, value }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
        marginBottom: 6,
      }}
    >
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "var(--text)" }}>{value}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {/* Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #e11d48, #f43f5e)",
          borderRadius: 20,
          padding: "1.25rem 1.75rem",
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
              width: 46,
              height: 46,
              borderRadius: 12,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ActivityIcon style={{ width: 22, height: 22, color: "#fff" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Health Records
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.8)",
                marginTop: 2,
              }}
            >
              {records.length} records on file
            </div>
          </div>
        </div>
        {/* Search in banner */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <SearchIcon
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 14,
              height: 14,
              color: "rgba(255,255,255,0.7)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search name, roll no, blood group…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              paddingLeft: 32,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              color: "#fff",
              fontSize: 12,
              outline: "none",
              width: 260,
              backdropFilter: "blur(8px)",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: -30,
            top: -30,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Table */}
      <div className="hms-card">
        <div style={{ padding: 0 }}>
          {isLoading ? (
            <div
              style={{
                padding: "2.5rem",
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              Loading health records…
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                padding: "2.5rem",
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              No records found.
            </div>
          ) : (
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Blood Group</th>
                  <th>Insurance</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => {
                  const rollNo =
                    typeof record.student === "object" &&
                    "rollNumber" in record.student
                      ? record.student.rollNumber
                      : "N/A";
                  return (
                    <tr key={record._id}>
                      <td>
                        <div className="name">{record.studentName}</div>
                      </td>
                      <td
                        style={{
                          fontSize: 12,
                          fontFamily: "monospace",
                          color: "var(--muted)",
                        }}
                      >
                        {rollNo}
                      </td>
                      <td>
                        <span className="hms-pill red">
                          {record.bloodGroup}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--muted)" }}>
                        {record.healthInsuranceDetails?.providerName || "N/A"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="hms-btn hms-btn-sm hms-btn-outline"
                          onClick={() => setSelectedRecord(record)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selectedRecord &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                width: "100%",
                maxWidth: 640,
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid var(--border)",
                  background: "rgba(225,29,72,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ActivityIcon
                    style={{ width: 18, height: 18, color: "#e11d48" }}
                  />
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    Health Record — {selectedRecord.studentName}
                  </div>
                </div>
                <button
                  className="hms-modal-close"
                  onClick={() => setSelectedRecord(null)}
                >
                  ×
                </button>
              </div>

              {/* Scrollable body */}
              <div
                className="custom-scrollbar"
                style={{
                  overflowY: "auto",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <InfoSection label="Vitals">
                    <InfoBlock>
                      <InfoRow
                        label="Blood Group"
                        value={
                          <span style={{ color: "#e11d48" }}>
                            {selectedRecord.bloodGroup}
                          </span>
                        }
                      />
                      <InfoRow
                        label="Height"
                        value={`${selectedRecord.heightCm} cm`}
                      />
                      <InfoRow
                        label="Weight"
                        value={`${selectedRecord.weightKg} kg`}
                      />
                    </InfoBlock>
                  </InfoSection>
                  <InfoSection label="Emergency Contact">
                    <InfoBlock>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text)",
                          marginBottom: 4,
                        }}
                      >
                        {selectedRecord.emergencyContact.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: 8,
                        }}
                      >
                        {selectedRecord.emergencyContact.relation}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: "var(--text2)",
                        }}
                      >
                        <PhoneIcon style={{ width: 12, height: 12 }} />
                        {selectedRecord.emergencyContact.phone}
                      </div>
                    </InfoBlock>
                  </InfoSection>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <InfoSection label="Known Allergies">
                    {selectedRecord.allergies.length > 0 ? (
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {selectedRecord.allergies.map((a, i) => (
                          <span key={i} className="hms-pill amber">
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        None reported
                      </span>
                    )}
                  </InfoSection>
                  <InfoSection label="Current Medications">
                    {selectedRecord.currentMedications.length > 0 ? (
                      <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                        {selectedRecord.currentMedications.map((m, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: 12,
                              color: "var(--text)",
                              marginBottom: 3,
                            }}
                          >
                            {m}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        None
                      </span>
                    )}
                  </InfoSection>
                </div>

                {selectedRecord.existingMedicalConditions.length > 0 && (
                  <InfoSection label="Existing Medical Conditions">
                    <div
                      style={{
                        background: "rgba(225,29,72,0.07)",
                        border: "1px solid rgba(225,29,72,0.2)",
                        borderRadius: 8,
                        padding: "0.75rem",
                        fontSize: 13,
                        color: "var(--text)",
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedRecord.existingMedicalConditions.join(", ")}
                    </div>
                  </InfoSection>
                )}

                <InfoSection label="General Medical History">
                  <div
                    style={{
                      background: "var(--bg2)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "0.875rem",
                      fontSize: 13,
                      color: "var(--text2)",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedRecord.medicalHistory || "No remarks provided."}
                  </div>
                </InfoSection>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <InfoSection label="Primary Doctor">
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {selectedRecord.doctorDetails.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        marginTop: 3,
                      }}
                    >
                      {selectedRecord.doctorDetails.hospital}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      {selectedRecord.doctorDetails.phone}
                    </div>
                  </InfoSection>
                  <InfoSection label="Health Insurance">
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {selectedRecord.healthInsuranceDetails.providerName}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: "var(--muted)",
                        marginTop: 3,
                      }}
                    >
                      {selectedRecord.healthInsuranceDetails.policyNumber}
                    </div>
                  </InfoSection>
                </div>

                <div
                  style={{
                    fontSize: 11,
                    textAlign: "right",
                    color: "var(--muted)",
                  }}
                >
                  Last Checkup:{" "}
                  {new Date(
                    selectedRecord.lastMedicalCheckup,
                  ).toLocaleDateString()}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "0.875rem 1.25rem",
                  borderTop: "1px solid var(--border)",
                  background: "var(--bg2)",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="hms-btn hms-btn-outline"
                  onClick={() => setSelectedRecord(null)}
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>,
          document.body,
        )}
    </motion.div>
  );
}
