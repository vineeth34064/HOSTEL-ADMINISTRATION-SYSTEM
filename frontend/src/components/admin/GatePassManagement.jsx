import React from 'react';
import { motion } from 'framer-motion';
import * as api from '../../services/api';
import { QrCodeIcon } from '../Icons';
const pillMap = { approved: 'green', pending: 'gold', rejected: 'red', out: 'blue', in: 'gray' };
const GatePassManagement = ({ requests, refreshData }) => {
    const handleApproval = async (id, approve) => {
        await api.approveGatePass(id, approve);
        refreshData();
    };
    const pending = requests.filter(r => r.status === 'pending').length;
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Banner */}
            <div style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-l))',
            borderRadius: 20, padding: '1.25rem 1.75rem', marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden',
        }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <QrCodeIcon style={{ width: 22, height: 22, color: '#fff' }}/>
                </div>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Gate Pass Requests</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{pending} pending approval · {requests.length} total</div>
                </div>
                <div style={{ position: 'absolute', right: -30, top: -30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
            </div>

            <div className="hms-card">
                <div style={{ padding: 0 }}>
                    {requests.length === 0 ? (<div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No gate pass requests.</div>) : (<table className="hms-table">
                            <thead><tr>
                                <th>Student</th><th>Reason</th><th>Departure</th><th>Return</th><th>Status</th><th>Actions</th>
                            </tr></thead>
                            <tbody>
                                {requests.map(req => (<tr key={req.id}>
                                        <td><div className="name">{req.studentName}</div><div className="sub">{req.rollNumber}</div></td>
                                        <td style={{ maxWidth: 200, fontSize: 12 }}>{req.reason}</td>
                                        <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(req.fromDate).toLocaleDateString()}</td>
                                        <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(req.toDate).toLocaleDateString()}</td>
                                        <td><span className={`hms-pill ${pillMap[req.status] || 'gray'}`}>{req.status}</span></td>
                                        <td>
                                            {req.status === 'pending' && (<div style={{ display: 'flex', gap: 6 }}>
                                                    <button className="hms-btn hms-btn-sm hms-btn-primary" onClick={() => handleApproval(req.id, true)}>Approve</button>
                                                    <button className="hms-btn hms-btn-sm hms-btn-danger" onClick={() => handleApproval(req.id, false)}>Reject</button>
                                                </div>)}
                                        </td>
                                    </tr>))}
                            </tbody>
                        </table>)}
                </div>
            </div>
        </motion.div>);
};
export default GatePassManagement;
