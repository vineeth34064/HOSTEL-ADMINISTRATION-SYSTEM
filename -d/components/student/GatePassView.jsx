import React, { useState } from "react";
import { motion } from "framer-motion";
import { GatePassStatus } from "../../types";
import * as api from "../../services/api";
import Modal from "../ui/Modal";
import PrintableGatePass from "./PrintableGatePass";
import { QrCodeIcon } from "../Icons";

const GatePassView = ({ user, gatePass, room, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSubmit = async () => {
    if (!user) return;
    if (!reason || !fromDate || !toDate) {
      alert("Please fill all fields");
      return;
    }
    await api.applyForGatePass(user.id, { reason, fromDate, toDate });
    refreshData();
    setIsModalOpen(false);
    setReason("");
    setFromDate("");
    setToDate("");
  };

  const status = gatePass?.status;
  const pillMap = {
    approved: "green",
    pending: "gold",
    rejected: "red",
    out: "blue",
    in: "gray",
  };

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
  };
  const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="print:hidden"
        style={{ maxWidth: 700 }}
      >
        {/* Banner */}
        <motion.div
          variants={item}
          style={{
            background: "linear-gradient(135deg, var(--gold), var(--gold-l))",
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
              <QrCodeIcon style={{ width: 24, height: 24, color: "#fff" }} />
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
                Gate Pass
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.8)",
                  marginTop: 2,
                }}
              >
                {gatePass
                  ? `Status: ${gatePass.status}`
                  : "No active gate pass"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {gatePass &&
              [GatePassStatus.APPROVED, GatePassStatus.OUT].includes(
                status,
              ) && (
                <button
                  className="hms-btn hms-btn-sm"
                  onClick={() => window.print()}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.3)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  🖨 Print
                </button>
              )}
            <button
              className="hms-btn hms-btn-sm"
              onClick={() => setIsModalOpen(true)}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              + Apply
            </button>
          </div>
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

        {/* Gate pass card */}
        <motion.div
          variants={item}
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {!gatePass ? (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              No gate pass applied. Click{" "}
              <strong style={{ color: "var(--gold)" }}>Apply</strong> to submit
              a request.
            </div>
          ) : (
            <>
              {/* Status header */}
              <div
                style={{
                  padding: "0.875rem 1.25rem",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--bg2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--muted)",
                  }}
                >
                  Gate Pass Details
                </span>
                <span
                  className={`hms-pill ${pillMap[gatePass.status] || "gray"}`}
                >
                  {gatePass.status}
                </span>
              </div>

              <div
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* Pending notice */}
                {gatePass.status === "pending" && (
                  <div
                    style={{
                      background: "var(--gold-bg)",
                      border: "1px solid rgba(184,149,46,0.25)",
                      borderRadius: 10,
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "var(--gold)",
                        fontSize: 13,
                        marginBottom: 4,
                      }}
                    >
                      ⏳ Awaiting Admin Approval
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        lineHeight: 1.5,
                      }}
                    >
                      Your request has been submitted and is under review.
                    </div>
                  </div>
                )}

                {/* Date grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.875rem",
                  }}
                >
                  {[
                    ["Departure", gatePass.fromDate],
                    ["Return", gatePass.toDate],
                  ].map(([label, date]) => (
                    <div
                      key={label}
                      style={{
                        background: "var(--bg2)",
                        borderRadius: 10,
                        padding: "0.875rem 1rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--muted)",
                          marginBottom: 4,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {new Date(date).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reason */}
                <div
                  style={{
                    background: "var(--bg2)",
                    borderRadius: 10,
                    padding: "0.875rem 1rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--muted)",
                      marginBottom: 4,
                    }}
                  >
                    Reason
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text2)",
                      lineHeight: 1.6,
                    }}
                  >
                    {gatePass.reason}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Apply for Gate Pass"
        >
          <div className="hms-form-row">
            <label className="hms-label">Reason for Leave</label>
            <textarea
              className="hms-input"
              placeholder="Briefly describe your reason…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div className="hms-form-row">
              <label className="hms-label">Departure Date &amp; Time</label>
              <input
                className="hms-input"
                type="datetime-local"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="hms-form-row">
              <label className="hms-label">Return Date &amp; Time</label>
              <input
                className="hms-input"
                type="datetime-local"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <button
            className="hms-btn hms-btn-primary"
            onClick={handleSubmit}
            style={{ width: "100%", justifyContent: "center" }}
          >
            Submit Application
          </button>
        </Modal>
      </motion.div>

      {/* Printable gate pass */}
      <div className="hidden print:block">
        {gatePass && user && gatePass.qrCodeData && (
          <PrintableGatePass pass={gatePass} user={user} room={room} />
        )}
      </div>
    </>
  );
};

export default GatePassView;
