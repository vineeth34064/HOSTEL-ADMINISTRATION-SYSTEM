import React from 'react';
import { motion } from 'framer-motion';
import * as api from '../../services/api';
import { CreditCardIcon } from '../Icons';
const FeeStatus = ({ students, refreshData }) => {
    const handleFeeUpdate = async (studentId) => {
        await api.manuallyUpdateFeeStatus(studentId);
        refreshData();
    };
    const paid = students.filter(s => s.feePaid).length;
    const due = students.length - paid;
    const rate = students.length ? Math.round((paid / students.length) * 100) : 0;
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Banner */}
            <div style={{
            background: 'linear-gradient(135deg, var(--green), #2ac48a)',
            borderRadius: 20, padding: '1.25rem 1.75rem',
            display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden',
        }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CreditCardIcon style={{ width: 22, height: 22, color: '#fff' }}/>
                </div>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Fee Status</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{rate}% collection rate · {students.length} students</div>
                </div>
                <div style={{ position: 'absolute', right: -30, top: -30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
            </div>

            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="hms-stat green">
                    <div className="hms-stat-label">Fees Paid</div>
                    <div className="hms-stat-value">{paid}</div>
                    <div className="hms-stat-bar"><div className="hms-stat-bar-fill" style={{ width: `${(paid / Math.max(students.length, 1)) * 100}%`, background: 'var(--green)' }}/></div>
                </div>
                <div className="hms-stat red">
                    <div className="hms-stat-label">Payment Due</div>
                    <div className="hms-stat-value">{due}</div>
                    <div className="hms-stat-bar"><div className="hms-stat-bar-fill" style={{ width: `${(due / Math.max(students.length, 1)) * 100}%`, background: 'var(--red)' }}/></div>
                </div>
                <div className="hms-stat gold">
                    <div className="hms-stat-label">Collection Rate</div>
                    <div className="hms-stat-value">{rate}<span>%</span></div>
                    <div className="hms-stat-bar"><div className="hms-stat-bar-fill" style={{ width: `${rate}%`, background: 'var(--gold)' }}/></div>
                </div>
            </div>

            {/* Table */}
            <div className="hms-card">
                <div className="hms-card-header">
                    <div>
                        <div className="hms-card-title">Fee Status by Student</div>
                        <div className="hms-card-sub">{students.length} total students</div>
                    </div>
                </div>
                <div style={{ padding: 0 }}>
                    {students.length === 0 ? (<div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No students found.</div>) : (<table className="hms-table">
                            <thead><tr>
                                <th>Student</th><th>Roll Number</th><th>Email</th><th>Status</th><th>Action</th>
                            </tr></thead>
                            <tbody>
                                {students.map(s => (<tr key={s.id}>
                                        <td><div className="name">{s.name}</div></td>
                                        <td style={{ fontSize: 12 }}>{s.rollNumber || '—'}</td>
                                        <td style={{ fontSize: 12, color: 'var(--muted)' }}>{s.email}</td>
                                        <td><span className={`hms-pill ${s.feePaid ? 'green' : 'red'}`}>{s.feePaid ? '✓ Cleared' : '⚠ Due'}</span></td>
                                        <td>
                                            {!s.feePaid && (<button className="hms-btn hms-btn-sm hms-btn-primary" onClick={() => handleFeeUpdate(s.id)}>Mark Paid</button>)}
                                        </td>
                                    </tr>))}
                            </tbody>
                        </table>)}
                </div>
            </div>
        </motion.div>);
};
export default FeeStatus;
