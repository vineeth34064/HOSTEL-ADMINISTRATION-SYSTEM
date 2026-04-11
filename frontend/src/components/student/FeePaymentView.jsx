import React from 'react';
import { motion } from 'framer-motion';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { CreditCardIcon } from '../Icons';
const FeePaymentView = ({ user }) => {
    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };
    return (<motion.div initial="hidden" animate="visible" variants={container} style={{ maxWidth: 600 }}>
            {/* Banner */}
            <motion.div variants={item} style={{
            background: user.feePaid
                ? 'linear-gradient(135deg, var(--green), #2ac48a)'
                : 'linear-gradient(135deg, var(--red), #e25858)',
            borderRadius: 20, padding: '1.5rem 2rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
            position: 'relative', overflow: 'hidden',
        }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CreditCardIcon style={{ width: 24, height: 24, color: '#fff' }}/>
                </div>
                <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Hostel Fee Payment</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                        Status: <strong style={{ color: '#fff' }}>{user.feePaid ? 'Cleared ✓' : 'Payment Pending'}</strong>
                    </div>
                </div>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
            </motion.div>

            {user.feePaid ? (<motion.div variants={item} style={{
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14,
                padding: '2.5rem', textAlign: 'center',
            }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>Fees Cleared</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>Your hostel fee for this semester has been paid. Thank you!</div>
                </motion.div>) : (<motion.div variants={item} style={{
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden',
            }}>
                    <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Scan to Pay via UPI</div>
                    </div>
                    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ fontSize: 13, color: 'var(--text2)', textAlign: 'center', maxWidth: 360 }}>
                            Scan the QR code below using any UPI app (GPay, PhonePe, Paytm) to pay your hostel fees.
                        </div>
                        <div style={{ background: '#fff', padding: 16, borderRadius: 16, border: '1px solid var(--border)' }}>
                            <QRCode value="https://www.eduqfix.com/PayDirect/#/student" size={220}/>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
                            After payment, it may take up to 24 hours for the status to reflect.
                        </div>
                    </div>
                </motion.div>)}
        </motion.div>);
};
export default FeePaymentView;
