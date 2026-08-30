'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, FileSearch, FilePlus, Scale, LifeBuoy, ArrowRight, Shield, Users, BookOpen } from 'lucide-react';
import Footer from './components/Footer';

const FEATURES = [
  {
    href: '/chat',
    icon: '💬',
    title: 'AI Legal Chat',
    titleHi: 'एआई कानूनी चैट',
    description: 'Ask any legal question and get clear, accurate answers about Indian law with proper citations.',
    descriptionHi: 'कोई भी कानूनी प्रश्न पूछें और भारतीय कानून के बारे में स्पष्ट, सटीक उत्तर प्राप्त करें।',
    color: '#6366F1',
  },
  {
    href: '/analyze',
    icon: '🔍',
    title: 'Document Analyzer',
    titleHi: 'दस्तावेज़ विश्लेषक',
    description: 'Upload legal documents for AI-powered analysis — get summaries, key points, and risk assessments.',
    descriptionHi: 'एआई विश्लेषण के लिए कानूनी दस्तावेज़ अपलोड करें — सारांश, मुख्य बिंदु और जोखिम मूल्यांकन प्राप्त करें।',
    color: '#10B981',
  },
  {
    href: '/generate',
    icon: '📝',
    title: 'Document Generator',
    titleHi: 'दस्तावेज़ जनरेटर',
    description: 'Generate legal document formats — affidavits, complaints, RTI applications, notices, and more.',
    descriptionHi: 'कानूनी दस्तावेज़ प्रारूप बनाएं — शपथ पत्र, शिकायत, आरटीआई आवेदन, नोटिस, और अधिक।',
    color: '#F59E0B',
  },
  {
    href: '/rights',
    icon: '⚖️',
    title: 'Know Your Rights',
    titleHi: 'अपने अधिकार जानें',
    description: 'Explore your fundamental, consumer, worker, women\'s, and digital rights under Indian law.',
    descriptionHi: 'भारतीय कानून के तहत अपने मौलिक, उपभोक्ता, श्रमिक, महिला और डिजिटल अधिकारों को जानें।',
    color: '#DB2777',
  },
  {
    href: '/legal-aid',
    icon: '🏛️',
    title: 'Legal Aid Directory',
    titleHi: 'कानूनी सहायता निर्देशिका',
    description: 'Find free legal aid services, helpline numbers, and state-wise legal services authorities.',
    descriptionHi: 'मुफ्त कानूनी सहायता सेवाएं, हेल्पलाइन नंबर और राज्यवार विधिक सेवा प्राधिकरण खोजें।',
    color: '#7C3AED',
  },
];

const STATS = [
  { icon: <Shield size={20} />, value: '400+', label: 'Indian Laws Covered', labelHi: '400+ भारतीय कानून' },
  { icon: <Users size={20} />, value: '24/7', label: 'Available Anytime', labelHi: '24/7 उपलब्ध' },
  { icon: <BookOpen size={20} />, value: 'Free', label: 'No Cost Legal Info', labelHi: 'मुफ्त कानूनी जानकारी' },
];

export default function HomePage() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('nyayasetu-lang') || 'en';
    setLang(saved);
    const handler = (e) => setLang(e.detail);
    window.addEventListener('langChange', handler);
    return () => window.removeEventListener('langChange', handler);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          ⚖️ {lang === 'hi' ? 'एआई-संचालित कानूनी सहायक' : 'AI-Powered Legal Assistant'}
        </div>
        <p className="hero-hindi">न्यायसेतु — न्याय का पुल</p>
        <h1>
          <span className="hero-gradient-text">NyayaSetu</span>
        </h1>
        <p>
          {lang === 'hi'
            ? 'अपने कानूनी अधिकारों को समझें, दस्तावेजों का विश्लेषण करें, कानूनी प्रारूप बनाएं, और मुफ्त कानूनी सहायता खोजें — सब एक ही जगह पर।'
            : 'Understand your legal rights, analyze documents, generate legal formats, and find free legal aid — all in one place.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/chat" className="btn btn-primary btn-lg">
            <MessageSquare size={18} />
            {lang === 'hi' ? 'चैट शुरू करें' : 'Start Legal Chat'}
          </Link>
          <Link href="/rights" className="btn btn-secondary btn-lg">
            <Scale size={18} />
            {lang === 'hi' ? 'अधिकार जानें' : 'Know Your Rights'}
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {STATS.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem' }}>
            <div style={{ color: 'var(--primary-500)' }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-500)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {lang === 'hi' ? stat.labelHi : stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="section-header text-center">
        <h2>{lang === 'hi' ? 'हमारी सेवाएं' : 'Our Services'}</h2>
        <p className="section-title-hi">सेवाएं जो आपकी कानूनी यात्रा को आसान बनाएं</p>
        <p>{lang === 'hi' ? 'चुनें कि आप क्या करना चाहते हैं' : 'Choose what you need help with'}</p>
      </div>

      <div className="feature-grid">
        {FEATURES.map((feature) => (
          <Link key={feature.href} href={feature.href} style={{ textDecoration: 'none' }}>
            <div className="card card-interactive feature-card" style={{ height: '100%', '--card-color': feature.color }}>
              <div className="feature-icon" style={{ background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)` }}>
                {feature.icon}
              </div>
              <h3>{lang === 'hi' ? feature.titleHi : feature.title}</h3>
              <p className="feature-title-hi">{lang === 'hi' ? feature.title : feature.titleHi}</p>
              <p>{lang === 'hi' ? feature.descriptionHi : feature.description}</p>
              <div className="feature-arrow">
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Emergency Helplines */}
      <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.02))', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
        <h3 style={{ color: 'var(--error)', marginBottom: '0.75rem', fontSize: '1rem' }}>
          🚨 {lang === 'hi' ? 'आपातकालीन हेल्पलाइन नंबर' : 'Emergency Helpline Numbers'}
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Police', labelHi: 'पुलिस', number: '100' },
            { label: 'Women Helpline', labelHi: 'महिला हेल्पलाइन', number: '181' },
            { label: 'Child Helpline', labelHi: 'चाइल्ड हेल्पलाइन', number: '1098' },
            { label: 'Cyber Crime', labelHi: 'साइबर अपराध', number: '1930' },
            { label: 'Legal Aid', labelHi: 'कानूनी सहायता', number: '15100' },
            { label: 'Emergency', labelHi: 'आपातकालीन', number: '112' },
          ].map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="btn btn-sm"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              📞 {lang === 'hi' ? item.labelHi : item.label}: <strong>{item.number}</strong>
            </a>
          ))}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
