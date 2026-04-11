import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendAIChatbotMessage } from '../../services/api';

const BotIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><path d="M8 15h.01M16 15h.01" />
    </svg>
);
const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);
const SendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
    </svg>
);
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

type Msg = { sender: 'user' | 'bot'; text: string; time: Date };

export default function AIChatbot() {
    const [isOpen, setIsOpen]             = useState(false);
    const [messages, setMessages]         = useState<Msg[]>([
        { sender: 'bot', text: 'Hi! I\'m your Hostel AI Assistant. Ask me about the mess menu, fee status, gate passes, or say "report an issue" to file a complaint.', time: new Date() }
    ]);
    const [input, setInput]               = useState('');
    const [chatbotState, setChatbotState] = useState('IDLE');
    const [contextData, setContextData]   = useState<any>(null);
    const [isLoading, setIsLoading]       = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;
        const text = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text, time: new Date() }]);
        setIsLoading(true);
        try {
            const res = await sendAIChatbotMessage(text, chatbotState, contextData);
            setChatbotState(res.newState || 'IDLE');
            if (res.contextData) setContextData((p: any) => ({ ...p, ...res.contextData }));
            setMessages(prev => [...prev, { sender: 'bot', text: res.reply, time: new Date() }]);
        } catch {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered a connection error. Please try again.', time: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* FAB */}
            <motion.button
                onClick={() => setIsOpen(true)}
                animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 10000,
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-l))',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(184,149,46,0.4)', color: '#fff',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <BotIcon />
            </motion.button>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        style={{
                            position: 'fixed', bottom: 92, right: 24, zIndex: 10000,
                            width: 360, height: 500, maxHeight: '80vh',
                            display: 'flex', flexDirection: 'column',
                            background: 'var(--bg)', border: '1px solid var(--border)',
                            borderRadius: 20, overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--gold), var(--gold-l))',
                            padding: '1rem 1.25rem', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                                }}>
                                    <BotIcon />
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>HMS Assistant</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 2px rgba(255,255,255,0.3)' }} />
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{
                                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: 8, color: '#fff', cursor: 'pointer', padding: 6,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="custom-scrollbar" style={{
                            flex: 1, overflowY: 'auto', padding: '1rem',
                            display: 'flex', flexDirection: 'column', gap: '0.875rem',
                            background: 'var(--bg2)',
                        }}>
                            <AnimatePresence initial={false}>
                                {messages.map((msg, idx) => {
                                    const isMine = msg.sender === 'user';
                                    return (
                                        <motion.div key={idx}
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: isMine ? 'row-reverse' : 'row', maxWidth: '88%', ...(isMine ? { marginLeft: 'auto' } : {}) }}>
                                            {/* Avatar */}
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                background: isMine ? 'linear-gradient(135deg, var(--gold), var(--gold-l))' : 'var(--bg3)',
                                                border: '1px solid var(--border)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: isMine ? '#fff' : 'var(--muted)',
                                            }}>
                                                {isMine ? <UserIcon /> : <BotIcon />}
                                            </div>
                                            {/* Bubble + time */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                                                <div style={{
                                                    padding: '0.625rem 0.875rem',
                                                    background: isMine ? 'linear-gradient(135deg, var(--gold), var(--gold-l))' : 'var(--bg)',
                                                    color: isMine ? '#fff' : 'var(--text)',
                                                    borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                                    border: isMine ? 'none' : '1px solid var(--border)',
                                                    fontSize: 13, lineHeight: 1.55,
                                                    boxShadow: isMine ? '0 4px 12px rgba(184,149,46,0.25)' : '0 1px 4px rgba(0,0,0,0.06)',
                                                }}>
                                                    {msg.text}
                                                </div>
                                                <div style={{ fontSize: 10, color: 'var(--muted)', paddingLeft: 4, paddingRight: 4 }}>
                                                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Typing indicator */}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                                        <BotIcon />
                                    </div>
                                    <div style={{ padding: '0.625rem 1rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 5, alignItems: 'center' }}>
                                        {[0, 0.15, 0.3].map((delay, i) => (
                                            <motion.div key={i}
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.7, repeat: Infinity, delay }}
                                                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)' }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} style={{
                            padding: '0.75rem 1rem', flexShrink: 0,
                            background: 'var(--bg)', borderTop: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask anything about the hostel…"
                                style={{
                                    flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
                                    borderRadius: 20, padding: '8px 14px', fontSize: 13,
                                    color: 'var(--text)', outline: 'none', transition: 'border-color 0.15s',
                                    fontFamily: 'DM Sans, sans-serif',
                                }}
                                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--gold)'; }}
                                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }}
                            />
                            <button type="submit" disabled={!input.trim() || isLoading}
                                style={{
                                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0, border: 'none',
                                    background: input.trim() && !isLoading ? 'linear-gradient(135deg, var(--gold), var(--gold-l))' : 'var(--bg3)',
                                    color: input.trim() && !isLoading ? '#fff' : 'var(--muted)',
                                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.15s', boxShadow: input.trim() && !isLoading ? '0 4px 12px rgba(184,149,46,0.3)' : 'none',
                                }}>
                                <SendIcon />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
