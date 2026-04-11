import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../../services/api';
import { TrophyIcon, SearchIcon } from '../Icons';
const SportsView = ({ user, isAdmin }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const load = async () => {
        try {
            const all = await api.getNotifications();
            setNotifications(all.filter((n) => n.category === 'sports'));
        }
        catch { }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => { load(); }, []);
    const handlePost = async () => {
        if (!title || !message) {
            alert('Please enter a headline and details.');
            return;
        }
        await api.createNotification({ title, message, category: 'sports', link });
        setTitle('');
        setMessage('');
        setLink('');
        await load();
    };
    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
    return (<motion.div initial="hidden" animate="visible" variants={container} style={{ maxWidth: 1000 }}>
            {/* Hero Banner */}
            <motion.div variants={item} style={{
            borderRadius: 24, overflow: 'hidden', marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, #1d4ed8, #4f46e5, #7c3aed)',
            padding: '2.5rem 2rem', position: 'relative',
        }}>
                {/* Animated blobs */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
                <motion.div animate={{ x: [0, 40, 0], y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', left: '30%', bottom: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(99,102,241,0.25)', filter: 'blur(24px)', pointerEvents: 'none' }}/>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#facc15', display: 'inline-block', animation: 'pulse 2s infinite' }}/> Live Arena Updates
                        </div>
                        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em', marginBottom: 8 }}>
                            Sports <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(90deg, #fde047, #fb923c)', backgroundClip: 'text' }}>Center</span>
                        </div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', maxWidth: 480, lineHeight: 1.6 }}>
                            Catch the latest tournament highlights, match schedules, and victory moments from across campus.
                        </div>
                    </div>
                    <motion.div animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.1)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', flexShrink: 0 }}>
                        <TrophyIcon style={{ width: 72, height: 72, color: '#facc15', filter: 'drop-shadow(0 0 14px rgba(250,204,21,0.5))' }}/>
                    </motion.div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '280px 1fr' : '1fr', gap: '1.25rem' }}>
                {/* Admin post form */}
                {isAdmin && (<motion.div variants={item}>
                        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', position: 'sticky', top: '1rem' }}>
                            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <TrophyIcon style={{ width: 16, height: 16, color: 'var(--gold)' }}/>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Post Update</span>
                            </div>
                            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div className="hms-form-row"><label className="hms-label">Headline</label><input className="hms-input" placeholder="e.g. Football Trials Today" value={title} onChange={e => setTitle(e.target.value)}/></div>
                                <div className="hms-form-row"><label className="hms-label">Details</label><textarea className="hms-input" placeholder="Timing, venue, registration info…" value={message} onChange={e => setMessage(e.target.value)} rows={4} style={{ resize: 'vertical' }}/></div>
                                <div className="hms-form-row"><label className="hms-label">Related Link (optional)</label><input className="hms-input" placeholder="https://…" value={link} onChange={e => setLink(e.target.value)}/></div>
                                <button className="hms-btn hms-btn-primary" onClick={handlePost} style={{ width: '100%', justifyContent: 'center' }}>Broadcast to Campus</button>
                            </div>
                        </div>
                    </motion.div>)}

                {/* Feed */}
                <div>
                    {isLoading ? (<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', fontSize: 13 }}>Loading…</div>) : notifications.length > 0 ? (<AnimatePresence mode="popLayout">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                                {notifications.map((n, idx) => (<motion.div key={n.id || idx} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(184,149,46,0.15)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(250,204,21,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <TrophyIcon style={{ width: 16, height: 16, color: '#eab308' }}/>
                                            </div>
                                            <span className="hms-pill gold">Sports News</span>
                                        </div>
                                        <div style={{ padding: '1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4 }}>{n.title}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, flex: 1 }}>{n.message}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                                                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Posted {new Date(n.createdAt).toLocaleDateString()}</span>
                                                {n.link && (<a href={n.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#fff', background: '#eab308', padding: '4px 10px', borderRadius: 20, textDecoration: 'none' }}>
                                                        OPEN <SearchIcon style={{ width: 10, height: 10 }}/>
                                                    </a>)}
                                            </div>
                                        </div>
                                    </motion.div>))}
                            </div>
                        </AnimatePresence>) : (<motion.div variants={item} style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg)', border: '2px dashed var(--border)', borderRadius: 14 }}>
                            <TrophyIcon style={{ width: 56, height: 56, color: 'var(--border)', margin: '0 auto 1rem' }}/>
                            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>The Stadium is Quiet</div>
                            <div style={{ fontSize: 13, color: 'var(--muted)' }}>No sports announcements yet. Stay tuned!</div>
                        </motion.div>)}
                </div>
            </div>
        </motion.div>);
};
export default SportsView;
