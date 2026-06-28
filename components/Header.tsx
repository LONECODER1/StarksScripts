"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/Header.module.css';
import { headerNavItems, NavSectionId } from '@/app/utils/data/HomePage.data';
import { signOut } from 'next-auth/react';

interface HeaderProps {
    session?: {
        user?: {
            name?: string | null;
            email?: string | null;
            id?: string | null;
        } | null;
    } | null;
}

const Header = ({ session }: HeaderProps) => {

    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<NavSectionId>(headerNavItems[0].id);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleRegister = () => {
        setMenuOpen(false);
        router.push('/register');
    };

    const handleLogin = () => {
        setMenuOpen(false);
        router.push('/login');
    };

    const handleSignOut = async () => {
        setMenuOpen(false);
        await signOut({ callbackUrl: '/' });
    };

    const closeMenu = () => setMenuOpen(false);
    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: NavSectionId) => {
        e.preventDefault();
        closeMenu();
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(sectionId);
        }
    };

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeMenu();
        };
        if (menuOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [menuOpen]);

    useEffect(() => {
        const observers = headerNavItems.map(({ id }) => {
            const element = document.getElementById(id);
            if (!element) return null;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                { rootMargin: '-80px 0px -55% 0px', threshold: 0 }
            );

            observer.observe(element);
            return observer;
        });

        return () => {
            observers.forEach((observer) => observer?.disconnect());
        };
    }, []);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.logoArea}>
                    <div className={styles.logoWrapper}>
                        <Image
                            src="/assets/markers/ironcore.png"
                            alt="Iron Core"
                            width={40}
                            height={40}
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>

                    <div className={styles.brandText}>
                        <div className={styles.brandName}>
                            Stark<span className={styles.brandAccent}>Scripts</span>
                        </div>
                        <div className={styles.brandTagline}>
                            Powered by Arc Reactor
                        </div>
                    </div>
                </div>

                <nav className={styles.nav} aria-label="Main navigation">
                    {headerNavItems.map((item, i) => (
                        <React.Fragment key={item.id}>
                            {i > 0 && <div className={styles.navDivider} />}
                            <a
                                href={`#${item.id}`}
                                className={`${styles.navLink} ${activeSection === item.id ? styles.navLinkActive : ''}`}
                                onClick={(e) => handleNavClick(e, item.id)}
                            >
                                {item.label}
                            </a>
                        </React.Fragment>
                    ))}
                </nav>

                <div className={styles.rightArea}>
                    <div className={styles.statusDot} />
                    {session?.user ? (
                        <>
                            <span className={styles.tagline}>
                                Welcome, {session.user.name || session.user.email}
                            </span>
                            <button
                                className={styles.logoutBtn}
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <span className={styles.tagline}>
                                New to StarkScripts?
                            </span>
                            <button
                                className={styles.loginBtn}
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                            <button
                                className={styles.registerBtn}
                                onClick={handleRegister}
                            >
                                Register
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        className={styles.themeToggleBtn}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <button
                        type="button"
                        className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ''}`}
                        onClick={toggleMenu}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        <span className={styles.menuBar} />
                        <span className={styles.menuBar} />
                        <span className={styles.menuBar} />
                    </button>
                </div>
            </header>

            <div
                className={`${styles.overlay} ${menuOpen ? styles.overlayVisible : ''}`}
                onClick={closeMenu}
                aria-hidden={!menuOpen}
            />

            <aside
                className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}
                aria-hidden={!menuOpen}
            >
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarBrand}>
                        <div className={styles.logoWrapper}>
                            <Image
                                src="/assets/markers/ironcore.png"
                                alt="Iron Core"
                                width={36}
                                height={36}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <div className={styles.brandText}>
                            <div className={styles.brandName}>
                                Stark<span className={styles.brandAccent}>Scripts</span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        &times;
                    </button>
                </div>

                <nav className={styles.sidebarNav} aria-label="Mobile navigation">
                    {headerNavItems.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`${styles.sidebarLink} ${activeSection === item.id ? styles.sidebarLinkActive : ''}`}
                            onClick={(e) => handleNavClick(e, item.id)}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    {session?.user ? (
                        <>
                            <span className={styles.sidebarTagline}>
                                Welcome, {session.user.name || session.user.email}
                            </span>
                            <button
                                className={styles.sidebarLogoutBtn}
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <span className={styles.sidebarTagline}>
                                New to StarkScripts?
                            </span>
                            <button
                                className={styles.sidebarLoginBtn}
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                            <button
                                className={styles.sidebarRegisterBtn}
                                onClick={handleRegister}
                            >
                                Register
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        className={styles.sidebarThemeBtn}
                        onClick={toggleTheme}
                    >
                        Theme: {theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Header;
