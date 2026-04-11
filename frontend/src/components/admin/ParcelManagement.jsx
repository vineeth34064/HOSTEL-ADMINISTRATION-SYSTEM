import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as api from '../../services/api';
import Modal from '../ui/Modal';
import { PackageIcon } from '../Icons';
const ParcelManagement = ({ parcels, students, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [courier, setCourier] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const handleSubmit = async () => {
        if (!studentId || !courier) {
            alert('Please select a student and enter courier name.');
            return;
        }
        await api.addParcel({ studentId, courier, trackingId });
        refreshData();
        setIsModalOpen(false);
        setStudentId('');
        setCourier('');
        setTrackingId('');
    };
    const pending = parcels.filter(p => !p.pickedUp && !p.collected).length;
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Banner */}
            <div style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            borderRadius: 20, padding: '1.25rem 1.75rem', marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
        }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <PackageIcon style={{ width: 22, height: 22, color: '#fff' }}/>
                    </div>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Parcel Registry</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{pending} awaiting pickup · {parcels.length} total</div>
                    </div>
                </div>
                <button className="hms-btn hms-btn-sm" onClick={() => setIsModalOpen(true)} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
                    + Add Parcel
                </button>
                <div style={{ position: 'absolute', right: -30, top: -30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
            </div>

            <div className="hms-card">
                <div style={{ padding: 0 }}>
                    {parcels.length === 0 ? (<div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No parcels recorded.</div>) : (<table className="hms-table">
                            <thead><tr>
                                <th>Student</th><th>Courier</th><th>Tracking ID</th><th>Status</th><th>Action</th>
                            </tr></thead>
                            <tbody>
                                {parcels.map(p => (<tr key={p.id}>
                                        <td><div className="name">{p.studentName}</div><div className="sub">{p.rollNumber}</div></td>
                                        <td style={{ fontSize: 12 }}>{p.courier || '—'}</td>
                                        <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--muted)' }}>{p.trackingId || '—'}</td>
                                        <td>
                                            <span className={`hms-pill ${(p.pickedUp || p.collected) ? 'green' : 'amber'}`}>
                                                {(p.pickedUp || p.collected) ? '✓ Collected' : '⏳ Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            {!p.pickedUp && !p.collected && (<button className="hms-btn hms-btn-sm hms-btn-primary" onClick={() => api.markParcelPickedUp(p.id).then(refreshData)}>
                                                    Mark Picked Up
                                                </button>)}
                                        </td>
                                    </tr>))}
                            </tbody>
                        </table>)}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Parcel">
                <div className="hms-form-row">
                    <label className="hms-label">Recipient Student</label>
                    <select className="hms-select" value={studentId} onChange={e => setStudentId(e.target.value)}>
                        <option value="">Select student…</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>)}
                    </select>
                </div>
                <div className="hms-form-row">
                    <label className="hms-label">Courier Name</label>
                    <input className="hms-input" placeholder="e.g. Amazon, Flipkart" value={courier} onChange={e => setCourier(e.target.value)}/>
                </div>
                <div className="hms-form-row">
                    <label className="hms-label">Tracking ID (Optional)</label>
                    <input className="hms-input" placeholder="e.g. AWB123456" value={trackingId} onChange={e => setTrackingId(e.target.value)}/>
                </div>
                <button className="hms-btn hms-btn-primary" onClick={handleSubmit} style={{ width: '100%', justifyContent: 'center' }}>Add Parcel</button>
            </Modal>
        </motion.div>);
};
export default ParcelManagement;
