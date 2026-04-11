import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, LostAndFoundItem, LostAndFoundStatus } from '../../types';
import * as api from '../../services/api';
import Modal from '../ui/Modal';
import { SearchIcon } from '../Icons';

const tabs: { id: 'all' | 'lost' | 'found'; label: string }[] = [
    { id: 'all',   label: 'All Items' },
    { id: 'lost',  label: '🔴 Lost'   },
    { id: 'found', label: '🟢 Found'  },
];

const LostAndFoundView: React.FC<{ user: User; items: LostAndFoundItem[]; refreshData: () => void }> = ({ user, items, refreshData }) => {
    const [isModalOpen, setIsModalOpen]   = useState(false);
    const [itemType, setItemType]         = useState<'lost' | 'found'>('lost');
    const [description, setDescription]  = useState('');
    const [location, setLocation]        = useState('');
    const [activeTab, setActiveTab]      = useState<'all' | 'lost' | 'found'>('all');

    const handleSubmit = async () => {
        if (!description || !location) { alert('Please fill all fields'); return; }
        await api.postLostAndFoundItem(user.id, { itemType, description, location });
        refreshData();
        setIsModalOpen(false);
        setDescription(''); setLocation('');
    };
    const handleClaim = async (itemId: string) => {
        if (confirm('Mark this item as claimed? This cannot be undone.')) {
            await api.claimLostAndFoundItem(itemId);
            refreshData();
        }
    };

    const filteredItems = useMemo(() =>
        activeTab === 'all' ? items : items?.filter(i => i.itemType === activeTab),
        [items, activeTab]
    );

    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const item      = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div initial="hidden" animate="visible" variants={container} style={{ maxWidth: 780 }}>
            {/* Banner */}
            <motion.div variants={item} style={{
                background: 'linear-gradient(135deg, var(--green), #2ac48a)',
                borderRadius: 20, padding: '1.5rem 2rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <SearchIcon style={{ width: 24, height: 24, color: '#fff' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Lost &amp; Found Board</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                            {items?.length || 0} item{items?.length !== 1 ? 's' : ''} posted campus-wide
                        </div>
                    </div>
                </div>
                <button className="hms-btn" onClick={() => setIsModalOpen(true)}
                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
                    + Post an Item
                </button>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
            </motion.div>

            {/* Tabs */}
            <motion.div variants={item} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                        padding: '0.5rem 1rem', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        border: '1px solid var(--border)',
                        background: activeTab === t.id ? 'var(--gold-bg)' : 'var(--bg)',
                        color:      activeTab === t.id ? 'var(--gold)'   : 'var(--muted)',
                        borderColor: activeTab === t.id ? 'var(--gold)'  : 'var(--border)',
                        transition: 'all 0.15s',
                    }}>{t.label}</button>
                ))}
            </motion.div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredItems && filteredItems.length > 0 ? filteredItems.map(i => (
                    <motion.div key={i.id} variants={item} style={{
                        background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden',
                        borderLeft: `4px solid ${i.itemType === 'lost' ? 'var(--red)' : 'var(--green)'}`,
                    }}>
                        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className={`hms-pill ${i.itemType === 'lost' ? 'red' : 'green'}`}>{i.itemType.toUpperCase()}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{i.description}</span>
                            </div>
                            <span className={`hms-pill ${i.status === LostAndFoundStatus.OPEN ? 'green' : 'gray'}`}>{i.status}</span>
                        </div>
                        <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                                <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                                    <strong style={{ color: 'var(--text)' }}>Location:</strong> {i.location}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                                    Posted by {i.studentName} · {new Date(i.datePosted).toLocaleDateString()}
                                </div>
                            </div>
                            {i.status === LostAndFoundStatus.OPEN && i.studentId !== user.id && (
                                <button className="hms-btn hms-btn-primary" style={{ flexShrink: 0, fontSize: 12 }} onClick={() => handleClaim(i.id)}>
                                    {i.itemType === 'lost' ? 'I Found This!' : 'This is Mine!'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )) : (
                    <motion.div variants={item} style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg)', border: '2px dashed var(--border)', borderRadius: 14, color: 'var(--muted)', fontSize: 13 }}>
                        No items found in this category.
                    </motion.div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post to Lost &amp; Found">
                <div className="hms-form-row">
                    <label className="hms-label">I have…</label>
                    <select className="hms-select" value={itemType} onChange={e => setItemType(e.target.value as 'lost' | 'found')}>
                        <option value="lost">Lost an item</option>
                        <option value="found">Found an item</option>
                    </select>
                </div>
                <div className="hms-form-row">
                    <label className="hms-label">Description</label>
                    <textarea className="hms-input" placeholder="Describe the item (brand, color, identifying marks)…" value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ resize: 'vertical' }} />
                </div>
                <div className="hms-form-row">
                    <label className="hms-label">Location</label>
                    <input className="hms-input" placeholder="Last seen / Found at (e.g. Library, Mess Hall)…" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <button className="hms-btn hms-btn-primary" onClick={handleSubmit} style={{ width: '100%', justifyContent: 'center' }}>Post Item</button>
            </Modal>
        </motion.div>
    );
};

export default LostAndFoundView;
