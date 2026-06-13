'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/styles/registerPage.module.css';
import Image from 'next/image';

const RegisterPage = () => {
  // 1. Correctly destructure useState
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className={styles.container}>
      {/* STATIC ELEMENTS: These render no matter what */}
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

          {/* CONDITIONAL RENDERING: Only the form area changes */}
          {otpSent ? (

            /* ======== UI AFTER OTP IS SENT ======== */
            <>
              <h1 className={styles.title}>
                Verify <span className={styles.highlight}>OTP</span>
              </h1>
              <p className={styles.subtitle}>Enter the code sent to your email</p>

              <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
                <div className={styles.fieldWrapper}>
                  <input
                    type="text"
                    id="otp"
                    placeholder=" "
                    className={styles.input}
                  />
                  <label htmlFor="otp" className={styles.label}>OTP Code</label>
                </div>

                <button type="submit" className={styles.button}>
                  Verify Account
                </button>
              </form>

              {/* Added a way to go back to the previous screen for testing */}
              <p className={styles.footerText}>
                Need to change your email?{' '}
                <button
                  onClick={() => setOtpSent(false)}
                  className={styles.link}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
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

              <form onSubmit={(e) => {
                e.preventDefault();
                setOtpSent(true); // Triggers the change to the OTP form
              }} className={styles.form}>

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
                  Send OTP
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
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;