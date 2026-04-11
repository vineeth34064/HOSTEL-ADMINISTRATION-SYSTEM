import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import * as api from "../../services/api";
import { HomeIcon } from "../Icons";

const RoomAllocation = ({ rooms, students, refreshData }) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const unallocated = useMemo(
    () => students.filter((s) => !s.room),
    [students],
  );

  const handleAllocate = async () => {
    if (!selectedStudent || !selectedRoom) {
      alert("Please select a student and a room.");
      return;
    }
    await api.allocateRoom(selectedStudent, selectedRoom);
    refreshData();
    setSelectedStudent("");
    setSelectedRoom("");
  };

  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0);
  const totalOccupants = rooms.reduce((s, r) => s + r.occupants.length, 0);
  const occupancyRate = totalCapacity
    ? Math.round((totalOccupants / totalCapacity) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {/* Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--gold), var(--gold-l))",
          borderRadius: 20,
          padding: "1.25rem 1.75rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
          <HomeIcon style={{ width: 22, height: 22, color: "#fff" }} />
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
            Room Allocation
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.8)",
              marginTop: 2,
            }}
          >
            {totalOccupants}/{totalCapacity} occupied · {occupancyRate}% rate ·{" "}
            {unallocated.length} unallocated students
          </div>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
        }}
      >
        {/* Allocate form */}
        <div className="hms-card">
          <div className="hms-card-header">
            <div className="hms-card-title">Allocate Room</div>
            <div className="hms-card-sub">{unallocated.length} unallocated</div>
          </div>
          <div
            className="hms-card-body"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            <div className="hms-form-row">
              <label className="hms-label">Select Student</label>
              <select
                className="hms-select"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Select unallocated student…</option>
                {unallocated.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
              </select>
            </div>
            <div className="hms-form-row">
              <label className="hms-label">
                Select Room (with available space)
              </label>
              <select
                className="hms-select"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value="">Select room…</option>
                {rooms
                  .filter((r) => r.occupants.length < r.capacity)
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.block}-{r.roomNumber} ({r.occupants.length}/
                      {r.capacity})
                    </option>
                  ))}
              </select>
            </div>
            <button
              className="hms-btn hms-btn-primary"
              onClick={handleAllocate}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Allocate Room
            </button>
          </div>
        </div>

        {/* Room occupancy */}
        <div className="hms-card">
          <div className="hms-card-header">
            <div className="hms-card-title">Room Occupancy</div>
            <div className="hms-card-sub">{rooms.length} rooms total</div>
          </div>
          <div
            className="hms-card-body"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            {rooms.map((room) => {
              const pct = room.capacity
                ? (room.occupants.length / room.capacity) * 100
                : 0;
              const full = room.occupants.length >= room.capacity;
              return (
                <div
                  key={room.id}
                  style={{
                    background: "var(--bg2)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    border: `1px solid ${full ? "rgba(201,64,64,0.2)" : "var(--border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {room.block}-{room.roomNumber}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        height: 4,
                        width: 80,
                        background: "var(--bg3)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: full ? "var(--red)" : "var(--gold)",
                          borderRadius: 2,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: full ? "var(--red)" : "var(--accent)",
                      }}
                    >
                      {room.occupants.length}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                      /{room.capacity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomAllocation;
