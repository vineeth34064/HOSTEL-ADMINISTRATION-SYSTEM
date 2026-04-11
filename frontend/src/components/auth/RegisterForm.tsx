import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface RegisterFormProps {
  authError: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ authError, onSubmit, onToggleMode }) => {
  return (
    <div className="hms-auth-wrap" style={{ alignItems: 'flex-start', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="hms-auth-card" style={{ maxWidth: '420px' }}>
        <div className="hms-auth-logo">
          <div className="hms-auth-logo-icon">
            <svg viewBox="0 0 20 20"><path d="M10 2L2 7v11h5v-5h6v5h5V7L10 2z"/></svg>
          </div>
          <div className="hms-auth-title">IIIT<span style={{ color: 'var(--gold)' }}>HMS</span></div>
          <div className="hms-auth-sub">Create your account to get started</div>
        </div>

        <form className="hms-auth-form" onSubmit={onSubmit}>
          {/* Full Name */}
          <div className="hms-form-row">
            <label className="hms-label">Full Name <span style={{ color: 'var(--red)' }}>*</span></label>
            <Input name="name" type="text" required placeholder="Your full name" />
          </div>

          {/* Email */}
          <div className="hms-form-row">
            <label className="hms-label">Email Address <span style={{ color: 'var(--red)' }}>*</span></label>
            <Input name="email" type="email" autoComplete="email" required placeholder="you@college.ac.in" />
          </div>

          {/* Password */}
          <div className="hms-form-row">
            <label className="hms-label">Password <span style={{ color: 'var(--red)' }}>*</span></label>
            <Input name="password" type="password" autoComplete="new-password" required placeholder="Min. 8 characters" />
          </div>

          {/* Phone Number */}
          <div className="hms-form-row">
            <label className="hms-label">Phone Number</label>
            <Input name="contactNumber" type="tel" placeholder="+91 98765 43210" />
          </div>

          {/* Roll Number */}
          <div className="hms-form-row">
            <label className="hms-label">
              Roll Number{' '}
              <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(Students only)</span>
            </label>
            <Input name="rollNumber" type="text" placeholder="e.g. CS21B001" />
          </div>

          {/* Error */}
          {authError && (
            <div style={{
              background: 'rgba(201,64,64,0.08)',
              border: '1px solid rgba(201,64,64,0.25)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              color: 'var(--red)',
            }}>
              {authError}
            </div>
          )}

          <Button type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
            Create Account
          </Button>
        </form>

        <div className="hms-auth-toggle">
          Already have an account?{' '}
          <button type="button" onClick={onToggleMode}>Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
