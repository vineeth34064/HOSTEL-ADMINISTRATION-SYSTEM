import React from 'react';
import { motion } from 'framer-motion';
import { BellIcon } from '../Icons';

const StudentDashboard = ({ user, notifications }) => {
    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <motion.div initial="hidden" animate="visible" variants={container} style={{ maxWidth: 820 }}>

            {/* Welcome Banner */}
            <motion.div
                variants={item}
                className="rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-l))' }}
            >
                {/* Left: Avatar + Name + Date */}
                <div className="flex items-center gap-4 relative z-10">
                    <div
                        className="flex items-center justify-center shrink-0 text-white font-black text-2xl"
                        style={{ width: 58, height: 58, borderRadius: 16, background: 'rgba(255,255,255,0.25)' }}
                    >
                        {user.name[0]}
                    </div>
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif', letterSpacing: '-0.01em' }}>
                            Welcome back, {user.name.split(' ')[0]}
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', marginTop: 3 }}>{today}</div>
                    </div>
                </div>

                {/* Right: Status Badge + Roll Number — stacks below left section on mobile */}
                <div className="relative z-10 flex flex-col items-start md:items-end gap-1">
                    <div className="flex items-center gap-2">
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block', boxShadow: '0 0 0 3px rgba(255,255,255,0.3)', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.9)' }}>
                            All Systems Operational
                        </span>
                    </div>
                    {user.rollNumber && (
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                            {user.rollNumber}
                        </div>
                    )}
                </div>

                {/* Decorative circles */}
                <div style={{ position: 'absolute', right: -40, top: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: 60, bottom: -60, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            </motion.div>

            {/* Quick stats — single column on mobile, 3-column grid on md+ */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {[
                    { label: 'Fee Status', value: user.feePaid ? 'Cleared' : 'Pending', color: user.feePaid ? 'var(--green)' : 'var(--red)' },
                    { label: 'Notifications', value: notifications?.length || 0, color: 'var(--accent)' },
                    { label: 'Access Level', value: user.role?.toUpperCase() || 'STUDENT', color: 'var(--gold)' },
                ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.1rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>{label}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>{value}</div>
                    </div>
                ))}
            </motion.div>

            {/* Announcements */}
            <motion.div variants={item} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <BellIcon style={{ width: 15, height: 15, color: 'var(--gold)' }} />
                        <span className="hms-card-title">Announcements</span>
                    </div>
                    <span className="hms-card-sub">{notifications?.length || 0} notification{notifications?.length !== 1 ? 's' : ''}</span>
                </div>

                {notifications && notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                        <motion.div
                            key={n.id || idx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            style={{
                                padding: '1rem 1.25rem',
                                borderBottom: idx < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                                borderLeft: '2px solid var(--gold)',
                            }}
                        >
                            <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, marginBottom: 3 }}>{n.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{n.message}</div>
                            {n.createdAt && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 6 }}>{new Date(n.createdAt).toLocaleString()}</div>}
                        </motion.div>
                    ))
                ) : (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                        No announcements yet. Check back later.
                    </div>
                )}
            </motion.div>

        </motion.div>
    );
};

export default StudentDashboard;
