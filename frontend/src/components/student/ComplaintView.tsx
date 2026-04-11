import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Complaint } from '../../types';
import * as api from '../../services/api';
import Modal from '../ui/Modal';
import { MessageSquareIcon } from '../Icons';

const ComplaintView: React.FC<{ user: User; complaints: Complaint[]; refreshData: () => void }> = ({ user, complaints, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!description) { alert('Please describe your complaint'); return; }
        await api.fileComplaint({ subject: 'Hostel Complaint', description });
        refreshData();
        setIsModalOpen(false);
        setDescription('');
    };

    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div initial="hidden" animate="visible" variants={container} style={{ maxWidth: 780 }}>
            {/* Banner */}
            <motion.div variants={item} style={{
                background: 'linear-gradient(135deg, var(--amber), #e8a840)',
                borderRadius: 20, padding: '1.5rem 2rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquareIcon style={{ width: 24, height: 24, color: '#fff' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Complaint Box</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{complaints?.length || 0} complaint{complaints?.length !== 1 ? 's' : ''} on record</div>
                    </div>
                </div>
                <button className="hms-btn" onClick={() => setIsModalOpen(true)}
                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
                    + File Complaint
                </button>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
            </motion.div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {complaints && complaints.length > 0 ? complaints.map((c) => (
                    <motion.div key={c.id} variants={item} style={{
                        background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden',
                    }}>
                        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.subject || 'Hostel Complaint'}</span>
                            <span className={`hms-pill ${c.status === 'resolved' ? 'green' : 'amber'}`}>{c.status}</span>
                        </div>
                        <div style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{c.description}</div>
                            {(c as any).createdAt && (
                                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                                    Filed on {new Date((c as any).createdAt).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )) : (
                    <motion.div variants={item} style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg)', border: '2px dashed var(--border)', borderRadius: 14, color: 'var(--muted)', fontSize: 13 }}>
                        No complaints filed yet.
                    </motion.div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="File a Complaint">
                <div className="hms-form-row">
                    <label className="hms-label">Describe your complaint in detail</label>
                    <textarea className="hms-input" placeholder="What happened? Be as detailed as possible…" value={description} onChange={e => setDescription(e.target.value)} rows={5} style={{ resize: 'vertical' }} />
                </div>
                <button className="hms-btn hms-btn-primary" onClick={handleSubmit} style={{ width: '100%', justifyContent: 'center' }}>Submit Complaint</button>
            </Modal>
        </motion.div>
    );
};

export default ComplaintView;