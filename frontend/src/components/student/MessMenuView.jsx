import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsIcon } from '../Icons';
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_ICONS = {
    breakfast: '☀️',
    lunch: '🌤️',
    snacks: '☕',
    dinner: '🌙',
};
const MEAL_COLORS = {
    breakfast: { accent: 'var(--amber)', bg: 'rgba(196,124,32,0.08)' },
    lunch: { accent: 'var(--green)', bg: 'rgba(26,158,106,0.08)' },
    snacks: { accent: 'var(--gold)', bg: 'rgba(184,149,46,0.08)' },
    dinner: { accent: 'var(--accent)', bg: 'rgba(40,114,212,0.08)' },
};
const MessMenuView = ({ menu }) => {
    const sortedMenu = menu
        ? [...menu].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
        : [];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
    };
    const rowVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
    };
    return (<motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Banner */}
      <motion.div variants={rowVariants} style={{
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '1.75rem',
            position: 'relative',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-l))',
            padding: '1.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
        }}>
        <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
          <UtensilsIcon style={{ width: 26, height: 26, color: '#fff' }}/>
        </div>
        <div>
          <div style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '-0.01em',
        }}>
            Weekly Mess Menu
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>
            Today is <strong style={{ color: '#fff' }}>{today}</strong>
          </div>
        </div>
        {/* Decorative circle */}
        <div style={{
            position: 'absolute',
            right: -30,
            top: -30,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            pointerEvents: 'none',
        }}/>
      </motion.div>

      {/* Day Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {sortedMenu.map((item) => {
            const isToday = item.day === today;
            return (<motion.div key={item.day} variants={rowVariants} style={{
                    background: 'var(--bg)',
                    border: `1px solid ${isToday ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: isToday
                        ? '0 4px 18px rgba(184,149,46,0.18)'
                        : '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                }}>
              {/* Day Header */}
              <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.75rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    background: isToday ? 'var(--gold-bg)' : 'var(--bg2)',
                }}>
                <span style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: isToday ? 'var(--gold)' : 'var(--text)',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                }}>
                  {item.day}
                </span>
                {isToday && (<span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        background: 'var(--gold)',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: 20,
                        letterSpacing: '0.06em',
                    }}>
                    TODAY
                  </span>)}
              </div>

              {/* Meal Grid */}
              <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 0,
                }}>
                {['breakfast', 'lunch', 'snacks', 'dinner'].map((meal, idx) => (<div key={meal} style={{
                        padding: '1rem 1.25rem',
                        borderRight: idx < 3 ? '1px solid var(--border)' : 'none',
                    }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 6,
                    }}>
                      <span style={{ fontSize: 14 }}>{MEAL_ICONS[meal]}</span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: MEAL_COLORS[meal].accent,
                    }}>
                        {meal}
                      </span>
                    </div>
                    <div style={{
                        fontSize: 13,
                        color: 'var(--text)',
                        lineHeight: 1.5,
                        fontWeight: 500,
                    }}>
                      {item[meal] || (<span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                          Not set
                        </span>)}
                    </div>
                  </div>))}
              </div>
            </motion.div>);
        })}
      </div>

      {!sortedMenu.length && (<div style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                color: 'var(--muted)',
                fontSize: 14,
            }}>
          No menu data available.
        </div>)}
    </motion.div>);
};
export default MessMenuView;
