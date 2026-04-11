import React from "react";
import { motion } from "framer-motion";
import { BellIcon } from "../Icons";

const StudentDashboard = ({ user, notifications }) => {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      style={{ maxWidth: 820 }}
    >
      {/* Welcome Banner */}
      <motion.div
        variants={item}
        style={{
          background: "linear-gradient(135deg, var(--gold), var(--gold-l))",
          borderRadius: 20,
          padding: "1.75rem 2rem",
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
              width: 58,
              height: 58,
              borderRadius: 16,
              background: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 900,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {user.name[0]}
          </div>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "Playfair Display, serif",
                letterSpacing: "-0.01em",
              }}
            >
              Welcome back, {user.name.split(" ")[0]}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.82)",
                marginTop: 3,
              }}
            >
              {today}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#fff",
                display: "inline-block",
                boxShadow: "0 0 0 3px rgba(255,255,255,0.3)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              All Systems Operational
            </span>
          </div>
          {user.rollNumber && (
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                marginTop: 6,
                fontFamily: "monospace",
              }}
            >
              {user.rollNumber}
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 60,
            bottom: -60,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* Quick stats row */}
      <motion.div
        variants={item}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.875rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Fee Status",
            value: user.feePaid ? "Cleared" : "Pending",
            color: user.feePaid ? "var(--green)" : "var(--red)",
            pill: user.feePaid ? "green" : "red",
          },
          {
            label: "Notifications",
            value: notifications?.length || 0,
            color: "var(--accent)",
            pill: "blue",
          },
          {
            label: "Access Level",
            value: user.role?.toUpperCase() || "STUDENT",
            color: "var(--gold)",
            pill: "gold",
          },
        ].map(({ label, value, color, pill }) => (
          <div
            key={label}
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "1.1rem 1.25rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${color}, transparent)`,
              }}
            />
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
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Announcements */}
      <motion.div
        variants={item}
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
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
            <BellIcon style={{ width: 15, height: 15, color: "var(--gold)" }} />
            <span className="hms-card-title">Announcements</span>
          </div>
          <span className="hms-card-sub">
            {notifications?.length || 0} notification
            {notifications?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {notifications && notifications.length > 0 ? (
          notifications.map((n, idx) => (
            <motion.div
              key={n.id || idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                padding: "1rem 1.25rem",
                borderBottom:
                  idx < notifications.length - 1
                    ? "1px solid var(--border)"
                    : "none",
                borderLeft: "2px solid var(--gold)",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--text)",
                  fontSize: 13,
                  marginBottom: 3,
                }}
              >
                {n.title}
              </div>
              <div
                style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}
              >
                {n.message}
              </div>
              {n.createdAt && (
                <div
                  style={{ fontSize: 10, color: "var(--muted)", marginTop: 6 }}
                >
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div
            style={{
              padding: "2.5rem",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 13,
            }}
          >
            No announcements yet. Check back later.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StudentDashboard;
