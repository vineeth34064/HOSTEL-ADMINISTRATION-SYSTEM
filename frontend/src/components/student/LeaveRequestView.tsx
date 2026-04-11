import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LeaveRequest } from '../../types';
import * as api from '../../services/api';
import Modal from '../ui/Modal';
import { FileTextIcon } from '../Icons';

const statusMap: Record<string, string> = { approved: 'green', rejected: 'red', pending: 'gold' };

const LeaveRequestView: React.FC<{ user: User; leaves: LeaveRequest[]; refreshData: () => void }> = ({ user, leaves, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleSubmit = async () => {
        if (!reason || !fromDate || !toDate) { alert('Please fill all fields'); return; }
        await api.applyForLeave({ reason, from: fromDate, to: toDate });
        refreshData();
        setIsModalOpen(false);
        setReason(''); setFromDate(''); setToDate('');
    };

    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div initial="hidden" animate="visible" variants={container} style={{ maxWidth: 780 }}>
            {/* Banner */}
            <motion.div variants={item} style={{
                background: 'linear-gradient(135deg, var(--accent), #5fa8ff)',
                borderRadius: 20, padding: '1.5rem 2rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileTextIcon style={{ width: 24, height: 24, color: '#fff' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Leave Requests</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{leaves?.length || 0} request{leaves?.length !== 1 ? 's' : ''} submitted</div>
                    </div>
                </div>
                <button className="hms-btn" onClick={() => setIsModalOpen(true)}
                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
                    + New Request
                </button>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
            </motion.div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {leaves && leaves.length > 0 ? leaves.map((leave) => (
                    <motion.div key={leave.id} variants={item} style={{
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: 14, overflow: 'hidden',
                    }}>
                        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Request Details</span>
                            <span className={`hms-pill ${statusMap[leave.status] || 'gray'}`}>{leave.status}</span>
                        </div>
                        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{leave.reason}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                                {[['From', leave.fromDate], ['To', leave.toDate]].map(([label, date]) => (
                                    <div key={label as string} style={{ background: 'var(--bg2)', borderRadius: 8, padding: '0.625rem 0.875rem' }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 3 }}>{label}</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{date ? new Date(date as string).toLocaleDateString() : 'Not set'}</div>
                                    </div>
                                ))}
                            </div>
                            {leave.createdAt && (
                                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                                    Submitted on {new Date(leave.createdAt).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )) : (
                    <motion.div variants={item} style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg)', border: '2px dashed var(--border)', borderRadius: 14, color: 'var(--muted)', fontSize: 13 }}>
                        No leave requests submitted yet.
                    </motion.div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Leave Request">
                <div className="hms-form-row"><label className="hms-label">Reason for Leave</label><textarea className="hms-input" placeholder="Briefly describe your reason…" value={reason} onChange={e => setReason(e.target.value)} rows={3} style={{ resize: 'vertical' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="hms-form-row"><label className="hms-label">From Date</label><input className="hms-input" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} /></div>
                    <div className="hms-form-row"><label className="hms-label">To Date</label><input className="hms-input" type="date" value={toDate} onChange={e => setToDate(e.target.value)} /></div>
                </div>
                <button className="hms-btn hms-btn-primary" onClick={handleSubmit} style={{ width: '100%', justifyContent: 'center' }}>Submit Application</button>
            </Modal>
        </motion.div>
    );
};

export default LeaveRequestView;