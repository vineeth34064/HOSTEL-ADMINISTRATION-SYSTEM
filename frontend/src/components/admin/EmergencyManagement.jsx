import React from 'react';
import { motion } from 'framer-motion';
import * as api from '../../services/api';
import { AlertTriangleIcon } from '../Icons';
const typeAccent = {
    Medical: 'var(--red)', Fire: 'var(--amber)',
    Security: 'var(--gold)', Other: 'var(--accent)',
};
const typeBg = {
    Medical: 'rgba(201,64,64,0.06)', Fire: 'rgba(196,124,32,0.06)',
    Security: 'rgba(184,149,46,0.06)', Other: 'rgba(40,114,212,0.06)',
};
const EmergencyManagement = ({ alerts, refreshData }) => {
    const handleAcknowledge = async (id) => {
        await api.acknowledgeEmergencyAlert(id);
        refreshData();
    };
    const active = alerts.filter(a => a.status === 'sent');
    const resolved = alerts.filter(a => a.status !== 'sent');
    const AlertRow = ({ alert }) => {
        const accent = typeAccent[alert.emergencyType] || typeAccent.Other;
        const bg = typeBg[alert.emergencyType] || typeBg.Other;
        const isActive = alert.status === 'sent';
        return (<div style={{
                borderLeft: `3px solid ${accent}`, background: bg,
                borderRadius: 10, padding: '1rem 1.25rem', marginBottom: 8,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{alert.emergencyType} Emergency</span>
                        <span className={`hms-pill ${isActive ? 'red' : 'green'}`}>{isActive ? '● Active' : '✓ Resolved'}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, lineHeight: 1.5 }}>{alert.description}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--muted)', flexWrap: 'wrap' }}>
                        <span><strong>Student:</strong> {alert.studentName} ({alert.rollNumber})</span>
                        {alert.roomDetails && <span><strong>Room:</strong> {alert.roomDetails}</span>}
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                </div>
                {isActive && (<button className="hms-btn hms-btn-sm hms-btn-primary" onClick={() => handleAcknowledge(alert.id)} style={{ flexShrink: 0 }}>
                        Acknowledge
                    </button>)}
            </div>);
    };
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Banner */}
            <div style={{
            background: 'linear-gradient(135deg, var(--red), #e25858)',
            borderRadius: 20, padding: '1.25rem 1.75rem',
            display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden',
        }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AlertTriangleIcon style={{ width: 22, height: 22, color: '#fff' }}/>
                </div>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Emergency Alerts</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{active.length} active · {resolved.length} resolved</div>
                </div>
                <div style={{ position: 'absolute', right: -30, top: -30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
            </div>

            {/* Active alert banner */}
            {active.length > 0 && (<div style={{ background: 'rgba(201,64,64,0.08)', border: '1px solid rgba(201,64,64,0.25)', borderRadius: 12, padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertTriangleIcon style={{ width: 18, height: 18, color: 'var(--red)', flexShrink: 0 }}/>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>
                        {active.length} active emergency alert{active.length > 1 ? 's' : ''} require attention
                    </div>
                </div>)}

            <div className="hms-card">
                <div className="hms-card-body">
                    {alerts.length === 0 ? (<div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, padding: '1rem 0' }}>
                            No emergency alerts. Campus is safe. 🟢
                        </div>) : (<>
                            {active.length > 0 && (<div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--red)', marginBottom: 10 }}>Active</div>
                                    {active.map(a => <AlertRow key={a.id} alert={a}/>)}
                                </div>)}
                            {resolved.length > 0 && (<div>
                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)', marginBottom: 10, paddingTop: active.length > 0 ? '0.75rem' : 0, borderTop: active.length > 0 ? '1px solid var(--border)' : 'none' }}>Resolved</div>
                                    {resolved.map(a => <AlertRow key={a.id} alert={a}/>)}
                                </div>)}
                        </>)}
                </div>
            </div>
        </motion.div>);
};
export default EmergencyManagement;
