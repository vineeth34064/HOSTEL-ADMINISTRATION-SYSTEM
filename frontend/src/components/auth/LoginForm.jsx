import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = ({ authError, onSubmit, onToggleMode }) => {
    return (
        <div className="hms-auth-wrap">
            <div className="hms-auth-card">
                <div className="hms-auth-logo">
                    <div className="hms-auth-logo-icon">
                        <svg viewBox="0 0 20 20"><path d="M10 2L2 7v11h5v-5h6v5h5V7L10 2z" /></svg>
                    </div>
                    <div className="hms-auth-title">IIIT<span style={{ color: 'var(--gold)' }}>HMS</span></div>
                    <div className="hms-auth-sub">
                        Welcome back — sign in to your account
                    </div>
                </div>

                <form className="hms-auth-form" onSubmit={onSubmit}>
                    <div className="hms-form-row">
                        <label className="hms-label">Email address</label>
                        <Input name="email" type="email" autoComplete="email" required placeholder="you@college.ac.in" />
                    </div>
                    <div className="hms-form-row">
                        <label className="hms-label">Password</label>
                        <Input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
                    </div>
                    {authError && (
                        <div style={{
                            background: 'rgba(201,64,64,0.08)',
                            border: '1px solid rgba(201,64,64,0.2)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            color: 'var(--red)',
                        }}>
                            {authError}
                        </div>
                    )}
                    <Button type="submit" className="w-full" style={{ justifyContent: 'center' }}>Sign In</Button>
                </form>

                <div className="hms-auth-toggle">
                    Don't have an account?{' '}
                    <button onClick={onToggleMode}>Register here</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
