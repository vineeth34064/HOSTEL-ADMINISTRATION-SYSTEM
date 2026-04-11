import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessMenuItem } from '../../types';
import * as api from '../../services/api';
import { UtensilsIcon } from '../Icons';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MessMenuEditor: React.FC<{ menu: MessMenuItem[]; refreshData: () => void }> = ({
  menu,
  refreshData,
}) => {
  const sorted = [...(menu || [])].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );
  const [editableMenu, setEditableMenu] = useState<MessMenuItem[]>(sorted);

  const handleMenuChange = (day: string, field: string, value: string) => {
    setEditableMenu((prev) =>
      prev.map((item) => (item.day === day ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    await api.updateMessMenu(editableMenu);
    refreshData();
    alert('Mess menu updated!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--gold), var(--gold-l))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UtensilsIcon style={{ width: 16, height: 16, color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              Edit Mess Menu
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
              Sorted Mon – Sun
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="hms-btn hms-btn-primary"
        >
          Save Changes
        </button>
      </div>

      {/* Column Headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr 1fr 1fr 1fr',
          gap: 0,
          padding: '0.5rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg3)',
        }}
      >
        {['Day', '☀️ Breakfast', '🌤️ Lunch', '☕ Snacks', '🌙 Dinner'].map((h) => (
          <div
            key={h}
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--muted)',
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      {editableMenu.map((item, i) => (
        <div
          key={item.day}
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 1fr 1fr 1fr',
            gap: 0,
            padding: '0.625rem 1.25rem',
            borderBottom: i < editableMenu.length - 1 ? '1px solid var(--border)' : 'none',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {item.day}
          </span>
          {(['breakfast', 'lunch', 'snacks', 'dinner'] as const).map((meal) => (
            <div key={meal} style={{ paddingRight: '0.75rem' }}>
              <input
                className="hms-input"
                value={item[meal]}
                onChange={(e) => handleMenuChange(item.day, meal, e.target.value)}
                placeholder={`${meal}…`}
                style={{ fontSize: 13 }}
              />
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

export default MessMenuEditor;