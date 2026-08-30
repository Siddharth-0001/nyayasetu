'use client';

import { useState, useEffect } from 'react';
import { Phone, Globe, Search } from 'lucide-react';
import { LEGAL_AID_RESOURCES, STATE_LEGAL_AID } from '../lib/constants';
import Footer from '../components/Footer';

export default function LegalAidPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('nyayasetu-lang') || 'en';
    setLang(saved);
    const handler = (e) => setLang(e.detail);
    window.addEventListener('langChange', handler);
    return () => window.removeEventListener('langChange', handler);
  }, []);

  const filteredStates = STATE_LEGAL_AID.filter(s =>
    s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.authority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="section-header">
        <h2>{lang === 'hi' ? '🏛️ कानूनी सहायता निर्देशिका' : '🏛️ Legal Aid Directory'}</h2>
        <p className="section-title-hi">{lang === 'hi' ? 'मुफ्त कानूनी सहायता सेवाएं और संपर्क' : 'कानूनी सहायता निर्देशिका'}</p>
        <p>
          {lang === 'hi'
            ? 'भारत के संविधान के अनुच्छेद 39A के तहत, आर्थिक या अन्य कारणों से कमजोर वर्गों को मुफ्त कानूनी सहायता का अधिकार है।'
            : 'Under Article 39A of the Indian Constitution, economically weaker sections have the right to free legal aid.'}
        </p>
      </div>

      {/* Who is eligible */}
      <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary-500)' }}>
        <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary-500)' }}>
          {lang === 'hi' ? '👥 मुफ्त कानूनी सहायता के लिए पात्र कौन है?' : '👥 Who is Eligible for Free Legal Aid?'}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          {lang === 'hi' ? 'विधिक सेवा प्राधिकरण अधिनियम, 1987 के तहत:' : 'Under the Legal Services Authorities Act, 1987:'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem' }}>
          {[
            { en: 'SC/ST community members', hi: 'अनुसूचित जाति/जनजाति के सदस्य' },
            { en: 'Women and children', hi: 'महिलाएं और बच्चे' },
            { en: 'Victims of human trafficking', hi: 'मानव तस्करी के पीड़ित' },
            { en: 'Persons with disabilities', hi: 'दिव्यांगजन' },
            { en: 'Industrial workers', hi: 'औद्योगिक श्रमिक' },
            { en: 'Persons in custody', hi: 'हिरासत में व्यक्ति' },
            { en: 'Victims of mass disaster or ethnic violence', hi: 'सामूहिक आपदा या जातीय हिंसा के पीड़ित' },
            { en: 'Annual income below ₹3,00,000 (Supreme Court) / ₹1,00,000 (other courts)', hi: 'वार्षिक आय ₹3,00,000 (सर्वोच्च न्यायालय) / ₹1,00,000 (अन्य न्यायालय) से कम' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--success)', flexShrink: 0 }}>✓</span>
              <span>{lang === 'hi' ? item.hi : item.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* National Helplines & Resources */}
      <h3 style={{ marginBottom: '1rem' }}>
        📞 {lang === 'hi' ? 'राष्ट्रीय हेल्पलाइन और संसाधन' : 'National Helplines & Resources'}
      </h3>
      <div className="aid-grid" style={{ marginBottom: '3rem' }}>
        {LEGAL_AID_RESOURCES.map((resource, i) => (
          <div key={i} className="card aid-card">
            <div className="aid-card-icon">
              {resource.phone ? <Phone size={20} style={{ color: 'var(--primary-500)' }} /> : <Globe size={20} style={{ color: 'var(--primary-500)' }} />}
            </div>
            <div className="aid-card-content">
              <h3>{lang === 'hi' ? resource.titleHi : resource.title}</h3>
              <span className="aid-title-hi">{lang === 'hi' ? resource.title : resource.titleHi}</span>
              <p>{resource.description}</p>
              <div className="aid-contact">
                {resource.phone && (
                  <a href={`tel:${resource.phone}`} className="aid-phone">
                    📞 {resource.phone}
                  </a>
                )}
                {resource.website && (
                  <a href={resource.website} target="_blank" rel="noopener noreferrer" className="aid-website">
                    🌐 {lang === 'hi' ? 'वेबसाइट' : 'Website'}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* State-wise Directory */}
      <h3 style={{ marginBottom: '1rem' }}>
        🗺️ {lang === 'hi' ? 'राज्यवार विधिक सेवा प्राधिकरण' : 'State-wise Legal Services Authorities'}
      </h3>

      <div className="search-container" style={{ maxWidth: '400px', margin: '0 0 1.5rem 0' }}>
        <Search size={18} className="search-icon" />
        <input
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'hi' ? 'राज्य खोजें...' : 'Search state...'}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="state-table">
          <thead>
            <tr>
              <th>{lang === 'hi' ? 'राज्य' : 'State'}</th>
              <th>{lang === 'hi' ? 'प्राधिकरण' : 'Authority'}</th>
              <th>{lang === 'hi' ? 'फ़ोन' : 'Phone'}</th>
              <th>{lang === 'hi' ? 'वेबसाइट' : 'Website'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredStates.map((state) => (
              <tr key={state.state}>
                <td style={{ fontWeight: 600 }}>{state.state}</td>
                <td>{state.authority}</td>
                <td>
                  <a href={`tel:${state.phone}`} className="aid-phone" style={{ fontSize: '0.78rem' }}>
                    📞 {state.phone}
                  </a>
                </td>
                <td>
                  <a href={state.website} target="_blank" rel="noopener noreferrer" className="aid-website" style={{ fontSize: '0.78rem' }}>
                    🌐 Visit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
