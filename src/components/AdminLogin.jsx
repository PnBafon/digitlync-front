/**
 * Admin Login Page - Secure route at /admin
 * Per website.txt: Clean login page, no public visibility of dashboard
 */
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { api } from '../api';
import AdminOtp from './AdminOtp';
import './AdminLogin.css';

function AdminLogin({ onAdminLoginSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('credentials');
  const [pendingAdmin, setPendingAdmin] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, err } = await api.login(form.username, form.password);
      if (err) {
        setError(err);
        return;
      }
      if (data?.success) {
        setPendingAdmin(data.admin || null);
        setStep('otp');
      } else {
        setError(data?.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = () => {
    try {
      if (pendingAdmin) localStorage.setItem('digilync_admin', JSON.stringify(pendingAdmin));
      localStorage.setItem('digilync_admin_session', '1');
    } catch (_) {}
    onAdminLoginSuccess?.();
  };

  const handleOtpBack = () => {
    setStep('credentials');
    setPendingAdmin(null);
    setError('');
  };

  if (step === 'otp') {
    return (
      <AdminOtp
        onVerified={handleOtpVerified}
        onBack={handleOtpBack}
      />
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src={logo} alt="Digilync" className="admin-login-logo" />
          <h1>Admin Login</h1>
          <p>Sign in to access the Digilync dashboard</p>
        </div>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <div className="admin-login-field">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              autoComplete="username"
              required
            />
          </div>
          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-login-password-wrap">
              <input
                id="admin-password"
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-login-password-toggle"
                onClick={() => setPasswordVisible((v) => !v)}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="admin-login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <a href="/" className="admin-login-back">← Back to website</a>
      </div>
    </div>
  );
}

export default AdminLogin;
