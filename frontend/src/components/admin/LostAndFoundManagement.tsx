import React from 'react';
import { motion } from 'framer-motion';
import { LostAndFoundItem, LostAndFoundStatus } from '../../types';
import * as api from '../../services/api';
import { SearchIcon } from '../Icons';

const LostAndFoundManagement: React.FC<{ items: LostAndFoundItem[]; refreshData: () => void }> = ({ items, refreshData }) => {
    const handleDelete = async (itemId: string) => {
        if (confirm('Permanently delete this item from the board?')) {
            await api.deleteLostAndFoundItem(itemId);
            refreshData();
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Banner */}
            <div style={{
                background: 'linear-gradient(135deg, var(--green), #2ac48a)',
                borderRadius: 20, padding: '1.25rem 1.75rem', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <SearchIcon style={{ width: 22, height: 22, color: '#fff' }} />
                </div>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Lost &amp; Found Management</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                        {items.filter(i => i.status === LostAndFoundStatus.OPEN).length} open · {items.length} total items
                    </div>
                </div>
                <div style={{ position: 'absolute', right: -30, top: -30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
            </div>

            <div className="hms-card">
                <div style={{ padding: 0 }}>
                    {!items || items.length === 0 ? (
                        <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No items on the Lost &amp; Found board.</div>
                    ) : (
                        <table className="hms-table">
                            <thead><tr>
                                <th>Type</th><th>Description</th><th>Location</th><th>Posted By</th><th>Status</th><th>Action</th>
                            </tr></thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <span className={`hms-pill ${item.itemType === 'lost' ? 'red' : 'green'}`}>
                                                {item.itemType.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 500, color: 'var(--text)', fontSize: 13 }}>{item.description}</td>
                                        <td style={{ fontSize: 12, color: 'var(--text2)' }}>{item.location}</td>
                                        <td>
                                            <div className="name">{item.studentName}</div>
                                            <div className="sub">{new Date(item.datePosted).toLocaleDateString()}</div>
                                        </td>
                                        <td>
                                            <span className={`hms-pill ${item.status === LostAndFoundStatus.OPEN ? 'green' : 'gray'}`}>{item.status}</span>
                                        </td>
                                        <td>
                                            <button className="hms-btn hms-btn-sm hms-btn-danger" onClick={() => handleDelete(item.id)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default LostAndFoundManagement;
