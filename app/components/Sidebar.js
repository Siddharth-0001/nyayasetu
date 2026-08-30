'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, FileSearch, FilePlus, Scale, LifeBuoy, X, Menu, Sun, Moon, Languages } from 'lucide-react';
import { NAV_LINKS } from '@/app/lib/constants';

const iconMap = {
  Home, MessageSquare, FileSearch, FilePlus, Scale, LifeBuoy,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('nyayasetu-theme') || 'dark';
    const savedLang = localStorage.getItem('nyayasetu-lang') || 'en';
    setTheme(savedTheme);
    setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('nyayasetu-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    localStorage.setItem('nyayasetu-lang', newLang);
    window.dispatchEvent(new CustomEvent('langChange', { detail: newLang }));
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu button in navbar */}
      <div className="navbar">
        <button className="mobile-menu-btn" onClick={() => setIsOpen(true)}>
          <Menu size={22} />
        </button>
        <span className="navbar-title">
          {lang === 'hi'
            ? NAV_LINKS.find(l => l.href === pathname)?.labelHi || 'न्यायसेतु'
            : NAV_LINKS.find(l => l.href === pathname)?.label || 'NyayaSetu'}
        </span>
        <div className="navbar-actions">
          <div className="lang-toggle">
            <button
              className={`lang-option ${lang === 'en' ? 'active' : ''}`}
              onClick={() => { setLang('en'); localStorage.setItem('nyayasetu-lang', 'en'); window.dispatchEvent(new CustomEvent('langChange', { detail: 'en' })); }}
            >
              EN
            </button>
            <button
              className={`lang-option ${lang === 'hi' ? 'active' : ''}`}
              onClick={() => { setLang('hi'); localStorage.setItem('nyayasetu-lang', 'hi'); window.dispatchEvent(new CustomEvent('langChange', { detail: 'hi' })); }}
            >
              हि
            </button>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">⚖️</div>
          <div className="sidebar-brand">
            <h1>NyayaSetu</h1>
            <span>न्यायसेतु — Bridge to Justice</span>
          </div>
          <button className="sidebar-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">
            {lang === 'hi' ? 'मेन्यू' : 'Menu'}
          </div>
          {NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon];
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {Icon && <Icon className="nav-icon" size={20} />}
                <span>{lang === 'hi' ? link.labelHi : link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--warning)' }}>⚠️ {lang === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}:</strong>{' '}
            {lang === 'hi'
              ? 'न्यायसेतु कानूनी जानकारी प्रदान करता है, कानूनी सलाह नहीं।'
              : 'NyayaSetu provides legal information, not legal advice.'}
          </div>
        </div>
      </aside>
    </>
  );
}
