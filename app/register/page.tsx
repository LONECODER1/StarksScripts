'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/registerPage.module.css';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const RegisterPage = () => {
  const router = useRouter();
  
  // State variables for inputs
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // Status states
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handlers for form submissions
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setSuccess((data.message || 'OTP sent to your email.') + (data.otp ? ` [DEV ONLY - OTP: ${data.otp}]` : ''));
      setOtpSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP code');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <video autoPlay loop muted playsInline className={styles.video}>
        <source src="/assets/videos/LoginVideo.mp4" type="video/mp4" />
      </video>

      <div className={styles.overlay} />

      <div className={styles.splitCard}>
        <div className={styles.imagePanel}>
          <Image
            src="/assets/RegisterAvatar.png"
            alt="StarkScripts hero"
            fill
            className={styles.image}
            sizes="(min-width: 900px) 420px, 0px"
            priority
          />
        </div>

        <div className={styles.formPanel}>
          {error && (
            <div style={{
              color: '#dc2626',
              background: '#fef2f2',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #fee2e2',
              fontSize: '0.85rem',
              textAlign: 'center',
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              color: '#16a34a',
              background: '#f0fdf4',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #dcfce7',
              fontSize: '0.85rem',
              textAlign: 'center',
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              {success}
            </div>
          )}

          {otpSent ? (
            /* ======== UI AFTER OTP IS SENT ======== */
            <>
              <h1 className={styles.title}>
                Verify <span className={styles.highlight}>OTP</span>
              </h1>
              <p className={styles.subtitle}>Enter the code sent to your email</p>

              <form onSubmit={handleVerifyOtp} className={styles.form}>
                <div className={styles.fieldWrapper}>
                  <input
                    type="text"
                    id="otp"
                    placeholder=" "
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={styles.input}
                    disabled={loading}
                  />
                  <label htmlFor="otp" className={styles.label}>OTP Code</label>
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify Account'}
                </button>
              </form>

              <p className={styles.footerText}>
                Need to change your email?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setError('');
                    setSuccess('');
                  }}
                  className={styles.link}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
                  disabled={loading}
                >
                  Go back
                </button>
              </p>
            </>
          ) : (
            /* ======== UI BEFORE OTP IS SENT ======== */
            <>
              <h1 className={styles.title}>
                Join <span className={styles.highlight}>StarkScripts</span>
              </h1>
              <p className={styles.subtitle}>Create your account to get started</p>

              <form onSubmit={handleSendOtp} className={styles.form}>
                <div className={styles.fieldWrapper}>
                  <input
                    type="text"
                    id="fullname"
                    placeholder=" "
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className={styles.input}
                    disabled={loading}
                  />
                  <label htmlFor="fullname" className={styles.label}>Full Name</label>
                </div>

                <div className={styles.fieldWrapper}>
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    disabled={loading}
                    autoComplete="email"
                  />
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                </div>

                <div className={styles.fieldWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${styles.input} ${styles.passwordInput}`}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeButton}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>

              <div className={styles.divider}>or</div>

              <div className={styles.oauthButtons}>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    signIn('google', { callbackUrl: '/landingPage' });
                  }}
                  className={styles.oauthButton}
                  disabled={loading}
                >
                  <FaGoogle className={`${styles.oauthIcon} ${styles.googleIcon}`} />
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    signIn('github', { callbackUrl: '/landingPage' });
                  }}
                  className={styles.oauthButton}
                  disabled={loading}
                >
                  <FaGithub className={`${styles.oauthIcon} ${styles.githubIcon}`} />
                  Continue with GitHub
                </button>
              </div>

              <p className={styles.footerText}>
                Already have an account?{' '}
                <Link href="/login" className={styles.link}>
                  Log in
                </Link>
              </p>

              <Link href="/" className={styles.backLink}>
                ← Back to home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;