import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, HealthRecord } from '../../types';
import * as api from '../../services/api';
import { ActivityIcon, PhoneIcon } from '../Icons';

export default function HealthRecordView({ user }: { user: User }) {
    const [record, setRecord]       = useState<HealthRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState('');

    useEffect(() => {
        api.getMyHealthRecord()
            .then(setRecord)
            .catch((err: any) => setError(err.message || 'Failed to load health record.'))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div style={{ padding: '2rem', color: 'var(--muted)', fontSize: 13 }}>Loading Health Record…</div>;
    if (error)     return <div style={{ padding: '2rem', color: 'var(--red)', fontSize: 13 }}>{error}</div>;
    if (!record)   return <div style={{ padding: '2rem', color: 'var(--muted)', fontSize: 13 }}>No health record found.</div>;

    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.09 } } };
    const item      = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

    const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{value}</span>
        </div>
    );
    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>{title}</div>
            {children}
        </div>
    );

    return (
        <motion.div initial="hidden" animate="visible" variants={container} style={{ maxWidth: 900 }}>
            {/* Banner */}
            <motion.div variants={item} style={{
                background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                borderRadius: 20, padding: '1.5rem 2rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ActivityIcon style={{ width: 24, height: 24, color: '#fff' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Personal Health Record</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                            Last check-up: {new Date(record.lastMedicalCheckup).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <span className="hms-pill" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', border: 'none', fontSize: 11 }}>
                    Blood: {record.bloodGroup}
                </span>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Vitals */}
                    <motion.div variants={item} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Vitals &amp; Info</div>
                        </div>
                        <div style={{ padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <InfoRow label="Blood Group" value={<span style={{ color: 'var(--red)', fontWeight: 700 }}>{record.bloodGroup}</span>} />
                            <InfoRow label="Height" value={`${record.heightCm} cm`} />
                            <InfoRow label="Weight" value={`${record.weightKg} kg`} />
                        </div>
                    </motion.div>

                    {/* Emergency Contact */}
                    <motion.div variants={item} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Emergency Contact</div>
                        </div>
                        <div style={{ padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{record.emergencyContact.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{record.emergencyContact.relation}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>
                                <PhoneIcon style={{ width: 13, height: 13 }} />
                                {record.emergencyContact.phone}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Medical Profile */}
                    <motion.div variants={item} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Medical Profile</div>
                        </div>
                        <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                            <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '0.875rem' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>Known Allergies</div>
                                {record.allergies.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {record.allergies.map((a, i) => <span key={i} className="hms-pill amber">{a}</span>)}
                                    </div>
                                ) : (
                                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>None reported</span>
                                )}
                            </div>
                            <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '0.875rem' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>Current Medications</div>
                                {record.currentMedications.length > 0 ? (
                                    <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                                        {record.currentMedications.map((m, i) => <li key={i} style={{ fontSize: 12, color: 'var(--text)', marginBottom: 3 }}>{m}</li>)}
                                    </ul>
                                ) : (
                                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>None</span>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Conditions & History */}
                    <motion.div variants={item} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Medical History &amp; Conditions</div>
                        </div>
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {record.existingMedicalConditions.length > 0 && (
                                <div style={{ background: 'rgba(201,64,64,0.07)', border: '1px solid rgba(201,64,64,0.2)', borderRadius: 8, padding: '0.75rem' }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 4 }}>Existing Conditions</div>
                                    <div style={{ fontSize: 13, color: 'var(--text)' }}>{record.existingMedicalConditions.join(', ')}</div>
                                </div>
                            )}
                            <div>
                                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginBottom: 4 }}>General Medical History</div>
                                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{record.medicalHistory || '—'}</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Doctor & Insurance */}
                    <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { label: 'Primary Doctor', lines: [record.doctorDetails.name, record.doctorDetails.hospital, record.doctorDetails.phone] },
                            { label: 'Health Insurance', lines: [record.healthInsuranceDetails.providerName, record.healthInsuranceDetails.policyNumber] },
                        ].map(({ label, lines }) => (
                            <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                                <div style={{ padding: '0.625rem 0.875rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>{label}</div>
                                </div>
                                <div style={{ padding: '0.875rem' }}>
                                    {lines.map((l, i) => (
                                        <div key={i} style={{ fontSize: i === 0 ? 13 : 12, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--text)' : 'var(--muted)', marginBottom: 3, fontFamily: i === 1 && label === 'Health Insurance' ? 'monospace' : 'inherit' }}>{l}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
