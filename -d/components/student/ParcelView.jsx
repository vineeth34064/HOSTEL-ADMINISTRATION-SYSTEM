import React from "react";
import { motion } from "framer-motion";
import * as api from "../../services/api";
import { PackageIcon } from "../Icons";

const ParcelView = ({ user, parcels, refreshData }) => {
  const handleCollect = async (parcelId) => {
    await api.collectParcel(parcelId);
    refreshData();
  };

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

  const pending = parcels?.filter((p) => !p.collected) || [];
  const collected = parcels?.filter((p) => p.collected) || [];

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
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          borderRadius: 20,
          padding: "1.5rem 2rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
          <PackageIcon style={{ width: 24, height: 24, color: "#fff" }} />
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
            Parcel Info
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
              marginTop: 2,
            }}
          >
            {pending.length} awaiting collection · {collected.length} collected
          </div>
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

      {parcels && parcels.length > 0 ? (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {parcels.map((p) => (
            <motion.div
              key={p.id}
              variants={item}
              style={{
                background: "var(--bg)",
                border: `1px solid ${!p.collected ? "rgba(124,58,237,0.3)" : "var(--border)"}`,
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: !p.collected
                  ? "0 4px 16px rgba(124,58,237,0.1)"
                  : "none",
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
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    {p.courier}
                  </span>
                </div>
                <span className={`hms-pill ${p.collected ? "gray" : "blue"}`}>
                  {p.collected ? "Collected" : "Pending"}
                </span>
              </div>
              <div
                style={{
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        background: "var(--bg2)",
                        borderRadius: 8,
                        padding: "0.625rem 0.875rem",
                      }}
                    >
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
                        Tracking ID
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--text)",
                          fontFamily: "monospace",
                        }}
                      >
                        {p.trackingId}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--bg2)",
                        borderRadius: 8,
                        padding: "0.625rem 0.875rem",
                      }}
                    >
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
                        Received On
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--text)",
                        }}
                      >
                        {new Date(p.receivedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                {!p.collected && (
                  <button
                    className="hms-btn hms-btn-primary"
                    onClick={() => handleCollect(p.id)}
                    style={{ flexShrink: 0 }}
                  >
                    Mark Collected
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
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
          No parcels awaiting collection.
        </motion.div>
      )}
    </motion.div>
  );
};

export default ParcelView;
