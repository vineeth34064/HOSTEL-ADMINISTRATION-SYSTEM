import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
const ResetPassword = ({ email, token, onSuccess }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            const { resetPassword } = await import('../../services/api');
            await resetPassword(email, token, newPassword);
            setMessage('Password reset successfully. You can now login.');
            setTimeout(() => onSuccess(), 2000);
        }
        catch (err) {
            setError(err.message || 'Failed to reset password');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="hms-auth-wrap">
      <div className="hms-auth-card">
        <div className="hms-auth-logo">
          <div className="hms-auth-logo-icon">
            <svg viewBox="0 0 20 20"><path d="M10 2L2 7v11h5v-5h6v5h5V7L10 2z"/></svg>
          </div>
          <div className="hms-auth-title">IIIT<span style={{ color: 'var(--gold)' }}>HMS</span></div>
          <div className="hms-auth-sub">Set a new password for {email}</div>
        </div>

        <form className="hms-auth-form" onSubmit={handleSubmit}>
          <div className="hms-form-row">
            <label className="hms-label">New Password</label>
            <Input name="newPassword" type="password" required placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
          </div>
          <div className="hms-form-row">
            <label className="hms-label">Confirm Password</label>
            <Input name="confirmPassword" type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          </div>
          
          {error && (<div style={{
                background: 'rgba(201,64,64,0.08)',
                border: '1px solid rgba(201,64,64,0.2)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                color: 'var(--red)',
                marginBottom: '1rem',
            }}>
              {error}
            </div>)}

          {message && (<div style={{
                background: 'rgba(52, 211, 153, 0.08)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                color: 'var(--green)',
                marginBottom: '1rem',
            }}>
              {message}
            </div>)}

          <Button type="submit" className="w-full" style={{ justifyContent: 'center' }} disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
          
          <div className="hms-auth-toggle" style={{ marginTop: '1.5rem' }}>
            <button type="button" onClick={onSuccess}>Back to login</button>
          </div>
        </form>
      </div>
    </div>);
};
export default ResetPassword;
