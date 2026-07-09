/**
 * Simulated OTP verification step after admin credential login.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './AdminOtp.css';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

function AdminOtp({ onVerified, onBack }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [resendPulse, setResendPulse] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const updateDigit = useCallback((index, value) => {
    const char = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    setError('');
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setDigits(next);
    setError('');
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const code = digits.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the full verification code.');
      return;
    }
    setVerifying(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600));
    if (code === '162534') {
      onVerified?.();
    } else {
      setError('Invalid verification code. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
    setVerifying(false);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(RESEND_COOLDOWN);
    setResendPulse(true);
    setTimeout(() => setResendPulse(false), 1200);
    setDigits(Array(OTP_LENGTH).fill(''));
    setError('');
    inputRefs.current[0]?.focus();
  };

  const filledCount = digits.filter(Boolean).length;

  return (
    <div className="admin-otp-page">
      <div className="admin-otp-bg-shapes" aria-hidden="true">
        <span className="admin-otp-shape admin-otp-shape-1" />
        <span className="admin-otp-shape admin-otp-shape-2" />
        <span className="admin-otp-shape admin-otp-shape-3" />
      </div>

      <div className="admin-otp-card">
        <div className="admin-otp-icon-wrap">
          <FaShieldAlt className="admin-otp-icon" aria-hidden="true" />
          <span className="admin-otp-icon-ring" aria-hidden="true" />
        </div>

        <div className="admin-otp-header">
          <img src={logo} alt="Digilync" className="admin-otp-logo" />
          <h1>Verify your identity</h1>
          <p>
            A 6-digit verification code has been sent to your registered device.
            Enter it below to continue.
          </p>
        </div>

        <form className="admin-otp-form" onSubmit={handleVerify}>
          {error && (
            <p className="admin-otp-error" role="alert">{error}</p>
          )}

          <div
            className="admin-otp-inputs"
            onPaste={handlePaste}
            role="group"
            aria-label="Verification code"
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className={`admin-otp-digit${digit ? ' admin-otp-digit-filled' : ''}`}
                value={digit}
                onChange={(e) => updateDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <div className="admin-otp-progress" aria-hidden="true">
            <div
              className="admin-otp-progress-bar"
              style={{ width: `${(filledCount / OTP_LENGTH) * 100}%` }}
            />
          </div>

          <button
            type="submit"
            className="admin-otp-submit"
            disabled={verifying || filledCount < OTP_LENGTH}
          >
            {verifying ? 'Verifying…' : 'Verify & Continue'}
          </button>
        </form>

        <div className="admin-otp-resend">
          {resendTimer > 0 ? (
            <p className="admin-otp-resend-timer">
              Resend code in <strong>{resendTimer}s</strong>
            </p>
          ) : (
            <button
              type="button"
              className={`admin-otp-resend-btn${resendPulse ? ' admin-otp-resend-pulse' : ''}`}
              onClick={handleResend}
            >
              Resend verification code
            </button>
          )}
        </div>

        <button type="button" className="admin-otp-back" onClick={onBack}>
          ← Back to sign in
        </button>
      </div>
    </div>
  );
}

export default AdminOtp;
