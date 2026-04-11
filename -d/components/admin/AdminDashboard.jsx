import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AlertTriangleIcon,
  UserIcon,
  FileTextIcon,
  MessageSquareIcon,
  PackageIcon,
  CreditCardIcon,
} from "../Icons";

const AdminDashboard = ({ analytics }) => {
  if (!analytics)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          color: "var(--muted)",
          fontSize: 14,
        }}
      >
        Loading analytics…
      </div>
    );

  const feePieData = [
    { name: "Fees Paid", value: analytics.feesPaid },
    { name: "Fees Pending", value: analytics.feesPending },
  ];
  const PIE_COLORS = ["var(--green)", "var(--red)"];

  const statCards = [
    {
      label: "Total Students",
      value: analytics.totalStudents,
      color: "blue",
      Icon: UserIcon,
    },
    {
      label: "On Leave",
      value: analytics.studentsOnLeave,
      color: "amber",
      Icon: FileTextIcon,
    },
    {
      label: "Outside Campus",
      value: analytics.studentsOut,
      color: "gold",
      Icon: PackageIcon,
    },
    {
      label: "Pending Complaints",
      value: analytics.pendingComplaints,
      color: "red",
      Icon: MessageSquareIcon,
    },
    {
      label: "Parcels to Collect",
      value: analytics.parcelsToCollect,
      color: "green",
      Icon: PackageIcon,
    },
    {
      label: "Fees Pending",
      value: analytics.feesPending,
      color: "amber",
      Icon: CreditCardIcon,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {/* Header Banner */}
      <motion.div
        variants={item}
        style={{
          background: "linear-gradient(135deg, var(--gold), var(--gold-l))",
          borderRadius: 20,
          padding: "1.75rem 2rem",
          marginBottom: "0.5rem",
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
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <UserIcon style={{ width: 26, height: 26, color: "#fff" }} />
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
              System Overview
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                marginTop: 3,
              }}
            >
              Command Center & Analytics Dashboard
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            right: -30,
            top: -30,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 80,
            bottom: -40,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* Emergency banner */}
      {analytics.pendingEmergencies > 0 && (
        <motion.div
          variants={item}
          style={{
            background: "rgba(201,64,64,0.08)",
            border: "1px solid rgba(201,64,64,0.25)",
            borderRadius: 12,
            padding: "1rem 1.25rem",
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
            <div style={{ fontWeight: 600, color: "var(--red)", fontSize: 13 }}>
              {analytics.pendingEmergencies} Active Emergency
              {analytics.pendingEmergencies > 1 ? "ies" : "y"}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Go to Emergency section to review and acknowledge.
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat cards */}
      <motion.div
        variants={item}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {statCards.map(({ label, value, color, Icon }) => (
          <div
            key={label}
            className={`hms-stat ${color}`}
            style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
          >
            <div style={{ flex: 1 }}>
              <div className="hms-stat-label">{label}</div>
              <div className="hms-stat-value">{value}</div>
            </div>
            <Icon
              style={{
                width: 18,
                height: 18,
                color: "var(--muted)",
                opacity: 0.5,
                marginTop: 2,
                flexShrink: 0,
              }}
            />
          </div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        variants={item}
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}
      >
        {/* Line chart */}
        <div className="hms-card">
          <div className="hms-card-header">
            <div>
              <div className="hms-card-title">Leave Trend</div>
              <div className="hms-card-sub">Last 7 days</div>
            </div>
          </div>
          <div className="hms-card-body">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={analytics.leaveRequestsOverTime.slice(-7)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    fontSize: 12,
                    color: "var(--text)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--gold)"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: "var(--gold)",
                    stroke: "var(--bg)",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="hms-card">
          <div className="hms-card-header">
            <div>
              <div className="hms-card-title">Fee Status</div>
              <div className="hms-card-sub">Paid vs Pending</div>
            </div>
          </div>
          <div className="hms-card-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={feePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {feePieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              {[
                ["var(--green)", `Paid (${analytics.feesPaid})`],
                ["var(--red)", `Pending (${analytics.feesPending})`],
              ].map(([clr, lbl]) => (
                <div
                  key={lbl}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    color: "var(--muted)",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: clr,
                      display: "inline-block",
                    }}
                  />
                  {lbl}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
