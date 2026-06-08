'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/app/styles/registerPage.module.css';
import Image from 'next/image';

const RegisterPage = () => {
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
            Join <span className={styles.highlight}>StarkScripts</span>
          </h1>
          <p className={styles.subtitle}>Create your account to get started</p>

          <form onSubmit={(e) => e.preventDefault()} className={styles.form}>

            <div className={styles.fieldWrapper}>
              <input
                type="text"
                id="fullname"
                placeholder=" "
                className={styles.input}
              />
              <label htmlFor="fullname" className={styles.label}>Full Name</label>
            </div>

            <div className={styles.fieldWrapper}>
              <input
                type="email"
                id="email"
                placeholder=" "
                className={styles.input}
              />
              <label htmlFor="email" className={styles.label}>Email Address</label>
            </div>

            <div className={styles.fieldWrapper}>
              <input
                type="password"
                id="password"
                placeholder=" "
                className={styles.input}
              />
              <label htmlFor="password" className={styles.label}>Password</label>
            </div>

            <button type="submit" className={styles.button}>
              Register
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link href="/login" className={styles.link}>
              Log in
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

export default RegisterPage;