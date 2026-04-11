import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../../services/api';
import { BellIcon, TrophyIcon, SearchIcon } from '../Icons';
const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('general');
    const [link, setLink] = useState('');
    const load = async () => { setNotifications(await api.getNotifications()); };
    useEffect(() => { load(); }, []);
    const handleCreate = async () => {
        if (!title || !message) {
            alert('Please enter title and message');
            return;
        }
        await api.createNotification({ title, message, category, link });
        setTitle('');
        setMessage('');
        setLink('');
        await load();
    };
    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
    return (<motion.div initial="hidden" animate="visible" variants={container} style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Banner */}
            <motion.div variants={item} style={{
            background: 'linear-gradient(135deg, var(--accent), #5fa8ff)',
            borderRadius: 20, padding: '1.25rem 1.75rem',
            display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden',
        }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BellIcon style={{ width: 22, height: 22, color: '#fff' }}/>
                </div>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Broadcast Center</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Push announcements to all students</div>
                </div>
                <div style={{ position: 'absolute', right: -30, top: -30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
            </motion.div>

            {/* Compose form */}
            <motion.div variants={item} className="hms-card">
                <div className="hms-card-header">
                    <div className="hms-card-title">New Announcement</div>
                </div>
                <div className="hms-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                        <div className="hms-form-row">
                            <label className="hms-label">Headline</label>
                            <input className="hms-input" placeholder="Enter attention-grabbing title" value={title} onChange={e => setTitle(e.target.value)}/>
                        </div>
                        <div className="hms-form-row">
                            <label className="hms-label">Category</label>
                            <select className="hms-select" value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="general">General Broadcast</option>
                                <option value="sports">Sports Arena</option>
                            </select>
                        </div>
                    </div>
                    <div className="hms-form-row">
                        <label className="hms-label">Resource Link (Optional)</label>
                        <input className="hms-input" placeholder="https://example.com/details" value={link} onChange={e => setLink(e.target.value)}/>
                    </div>
                    <div className="hms-form-row">
                        <label className="hms-label">Message Content</label>
                        <textarea className="hms-input" placeholder="Write your announcement here…" value={message} onChange={e => setMessage(e.target.value)} rows={4} style={{ resize: 'vertical' }}/>
                    </div>
                    <button className="hms-btn hms-btn-primary" onClick={handleCreate} style={{ width: '100%', justifyContent: 'center' }}>
                        Push Announcement
                    </button>
                </div>
            </motion.div>

            {/* History feed */}
            <motion.div variants={item}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)', marginBottom: '0.875rem' }}>
                    History Feed — {notifications.length} published
                </div>
                <AnimatePresence mode="popLayout">
                    {notifications.length === 0 ? (<div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg)', border: '2px dashed var(--border)', borderRadius: 14, color: 'var(--muted)', fontSize: 13 }}>
                            No announcements published yet.
                        </div>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {notifications.map((n, idx) => (<motion.div key={n.id || idx} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }} style={{
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderLeft: `3px solid ${n.category === 'sports' ? 'var(--gold)' : 'var(--accent)'}`,
                    borderRadius: 12, overflow: 'hidden',
                }}>
                                    <div style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                                                <span className={`hms-pill ${n.category === 'sports' ? 'gold' : 'blue'}`}>{n.category || 'general'}</span>
                                            </div>
                                            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{n.message}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                                                {n.link && (<span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                                                        <SearchIcon style={{ width: 11, height: 11 }}/> Link attached
                                                    </span>)}
                                            </div>
                                        </div>
                                        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {n.category === 'sports'
                    ? <TrophyIcon style={{ width: 16, height: 16, color: 'var(--gold)' }}/>
                    : <BellIcon style={{ width: 16, height: 16, color: 'var(--accent)' }}/>}
                                        </div>
                                    </div>
                                </motion.div>))}
                        </div>)}
                </AnimatePresence>
            </motion.div>
        </motion.div>);
};
export default AdminNotifications;
