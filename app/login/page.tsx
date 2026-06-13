'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/styles/registerPage.module.css';

const LoginPage = () => {
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

          <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
            <div className={styles.fieldWrapper}>
              <input
                type="email"
                id="login-email"
                placeholder=" "
                className={styles.input}
                autoComplete="email"
              />
              <label htmlFor="login-email" className={styles.label}>
                Email Address
              </label>
            </div>

            <div className={styles.fieldWrapper}>
              <input
                type="password"
                id="login-password"
                placeholder=" "
                className={styles.input}
                autoComplete="current-password"
              />
              <label htmlFor="login-password" className={styles.label}>
                Password
              </label>
            </div>

            <div className={styles.forgotWrapper}>
              <Link href="#" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.button}>
              Log In
            </button>
          </form>

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
