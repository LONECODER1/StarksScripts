'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from '@/app/styles/registerPage.module.css';
import { Eye, EyeOff } from 'lucide-react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const LoginPage = () => {
  const router = useRouter();

  // Inputs state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Trigger credentials login using next-auth/react
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error);
      } else if (res?.ok) {
        setSuccess('Logged in successfully! Redirecting to landing page...');
        setTimeout(() => {
          router.push('/landingPage');
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong during login';
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
          <h1 className={styles.title}>
            Welcome to <span className={styles.highlight}>StarkScripts</span>
          </h1>
          <p className={styles.subtitle}>Sign in to access your account</p>

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

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.fieldWrapper}>
              <input
                type="email"
                id="login-email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                autoComplete="email"
                disabled={loading}
              />
              <label htmlFor="login-email" className={styles.label}>
                Email Address
              </label>
            </div>

            <div className={styles.fieldWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${styles.passwordInput}`}
                autoComplete="current-password"
                disabled={loading}
              />
              <label htmlFor="login-password" className={styles.label}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className={styles.forgotWrapper}>
              <Link href="#" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
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
            Don&apos;t have an account?{' '}
            <Link href="/register" className={styles.link}>
              Register
            </Link>
          </p>

          <Link href="/" className={styles.backLink}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
