import React, { useState } from 'react';

const ROLES = [
  { id: 'Administrator', label: 'Admin', icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.5V10c0-2.5-.5-4.5-2.5-4.5M21 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" },
  { id: 'Student', label: 'Student', icon: "M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3h8" },
  { id: 'Staff/Faculty', label: 'Staff', icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" },
  { id: 'HR', label: 'HR', icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8 4v6m3-3h-6" },
  { id: 'Accounts', label: 'Accounts', icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { id: 'Transport', label: 'Transport', icon: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm13 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" },
  { id: 'Agent', label: 'Agent', icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857" }
];

export default function Login({ onLogin }) {
  const [role, setRole] = useState('Administrator');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@UctErp2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username or email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, role })
    })
      .then(async (res) => {
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
          setError(data.error || 'Authentication failed. Please check your credentials.');
        } else {
          sessionStorage.setItem('uct_token', data.token);
          onLogin(data.user);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError('Server is offline or connection refused. Please try again.');
      });
  };

  return (
    <div className="login-container">
      {/* Left Pane - Premium Drifting Aurora Background with Overlay Photo */}
      <div className="login-info-pane">
        <div className="login-info-pane-bg" />
        
        {/* Top Branding Logo */}
        <div className="login-info-logo-row">
          <div className="login-info-logo-box">
            <img
              src="/uct-logo.png.jpeg"
              alt="UCT Logo"
              className="login-info-logo-img"
            />
          </div>
          <span className="login-info-brand-name">UCT ERP</span>
        </div>

        {/* Center Content - Brand and Badging */}
        <div className="login-info-center-content">
          <div className="login-info-badge">
            <span className="pulsing-dot" />
            Official Portal
          </div>
          <h1 className="login-info-title">
            Universidade Católica <br /> Timorense
          </h1>
          <p className="login-info-desc">
            Access UCT's consolidated educational platform for medical students, clinical staff, and agents.
          </p>
        </div>

        {/* Bottom Footer Info */}
        <div className="login-info-footer">
          <span className="login-footer-security">
            <svg className="security-icon" width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746a1 1 0 01.616.92v5.334c0 4.82-3.3 9.32-8 10.35-4.7-1.03-8-5.53-8-10.35V5.82a1 1 0 01.616-.92zM10 3.12L3.5 6.22v4.28c0 3.96 2.62 7.7 6.5 8.6a9.5 9.5 0 006.5-8.6V6.22L10 3.12z" clipRule="evenodd" />
            </svg>
            Secure SSL Encrypted
          </span>
          <span className="login-footer-separator">•</span>
          <span className="login-footer-copyright">© 2026 UCT</span>
        </div>
      </div>

      {/* Right Pane - Form Card on Soft Grid Canvas */}
      <div className="login-form-pane">
        <div className="login-form-wrapper-inner">
          
          <div className="login-card-container">
            <div className="login-form-header">
              <h2 className="login-form-title">Sign In</h2>
              <p className="login-form-subtitle">Choose your portal role and enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-actual-form">
              {error && (
                <div className="login-error-alert">
                  <svg className="error-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Role Selection Chips */}
              <div className="login-form-field">
                <label className="login-field-label">SELECT YOUR PORTAL</label>
                <div className="login-role-chips">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`login-role-chip ${role === r.id ? 'active' : ''}`}
                      onClick={() => setRole(r.id)}
                      disabled={loading}
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d={r.icon} />
                      </svg>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Username */}
              <div className="login-form-field">
                <label className="login-field-label">USERNAME OR EMAIL</label>
                <div className="login-input-container">
                  <span className="login-input-icon-left">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin"
                    disabled={loading}
                    className="login-text-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-form-field">
                <label className="login-field-label">PASSWORD</label>
                <div className="login-input-container">
                  <span className="login-input-icon-left">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={loading}
                    className="login-text-input"
                  />
                  <button
                    type="button"
                    className="login-password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="login-form-options">
                <label className="login-remember-me-checkbox">
                  <input type="checkbox" defaultChecked disabled={loading} className="login-checkbox" />
                  <span>Remember me</span>
                </label>
                <a 
                  href="#forgot" 
                  className="login-forgot-password-link" 
                  onClick={(e) => { e.preventDefault(); alert('Please contact system administrator to reset password.'); }}
                >
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <button type="submit" className="login-submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <div className="login-spinner" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="button-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Features Badges */}
        <div className="login-features-row">
          <div className="login-feature-badge-item">
            <div className="feature-icon-wrapper secure-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="feature-badge-label">SECURE</span>
          </div>

          <div className="login-feature-badge-item">
            <div className="feature-icon-wrapper scalable-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="feature-badge-label">SCALABLE</span>
          </div>

          <div className="login-feature-badge-item">
            <div className="feature-icon-wrapper realtime-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="feature-badge-label">REALTIME</span>
          </div>
        </div>
      </div>
    </div>
  );
}
