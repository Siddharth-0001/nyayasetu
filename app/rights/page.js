'use client';

import { useState, useEffect } from 'react';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RIGHTS_CATEGORIES } from '../lib/constants';
import Footer from '../components/Footer';

export default function RightsPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('nyayasetu-lang') || 'en';
    setLang(saved);
    const handler = (e) => setLang(e.detail);
    window.addEventListener('langChange', handler);
    return () => window.removeEventListener('langChange', handler);
  }, []);

  const explainTopic = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    setExplanation('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Explain this legal right/topic in detail for an Indian citizen: "${topic}". Include relevant Constitutional Articles, Acts, Sections, practical examples, how to exercise this right, and relevant government schemes.`,
          history: [],
          language: lang,
        }),
      });
      const data = await response.json();
      setExplanation(data.response || 'Could not load explanation.');
    } catch (error) {
      setExplanation('⚠️ Error loading explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchLegal = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchResults(null);

    try {
      const response = await fetch('/api/legal-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setSearchResults({ error: 'Search failed. Please try again.' });
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>{lang === 'hi' ? '⚖️ अपने अधिकार जानें' : '⚖️ Know Your Rights'}</h2>
        <p className="section-title-hi">{lang === 'hi' ? 'भारतीय कानून के तहत अपने अधिकारों को समझें' : 'अपने अधिकार जानें'}</p>
        <p>
          {lang === 'hi'
            ? 'किसी भी श्रेणी पर क्लिक करके अपने अधिकारों के बारे में विस्तार से जानें, या कानूनी विषय खोजें।'
            : 'Click on any category to learn about your rights in detail, or search for specific legal topics.'}
        </p>
      </div>

      {/* Legal Search */}
      <div className="search-container">
        <div style={{ position: 'relative' }}>
          <Search size={18} className="search-icon" />
          <input
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchLegal()}
            placeholder={lang === 'hi' ? 'कानूनी विषय खोजें (जैसे: किरायेदार अधिकार, FIR)...' : 'Search legal topics (e.g., tenant rights, FIR, RTI)...'}
          />
        </div>
        {searchQuery && (
          <button className="btn btn-primary btn-sm" onClick={searchLegal} disabled={searchLoading} style={{ marginTop: '0.5rem' }}>
            {searchLoading ? <Loader2 size={14} /> : <Search size={14} />}
            {lang === 'hi' ? ' खोजें' : ' Search Indian Kanoon'}
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--info)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
            🔍 {lang === 'hi' ? 'खोज परिणाम' : 'Search Results'}
            {searchResults.searchUrl && (
              <a href={searchResults.searchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ marginLeft: '0.5rem' }}>
                <ExternalLink size={12} /> Indian Kanoon
              </a>
            )}
          </h3>
          {searchResults.results?.map((result, i) => (
            <div key={i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i < searchResults.results.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <a href={result.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-500)', fontWeight: 600, fontSize: '0.95rem' }}>
                {result.title} <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>
              {result.court && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '0.5rem' }}>{result.court}</span>}
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{result.snippet}</p>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={() => setSearchResults(null)}>
            {lang === 'hi' ? '✕ बंद करें' : '✕ Close results'}
          </button>
        </div>
      )}

      {/* Rights Categories */}
      {!selectedCategory && (
        <div className="rights-grid">
          {RIGHTS_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="card card-interactive rights-card"
              style={{ '--card-color': cat.color }}
              onClick={() => setSelectedCategory(cat)}
            >
              <div className="rights-card-header">
                <div className="rights-card-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                  {cat.icon}
                </div>
                <div>
                  <h3>{lang === 'hi' ? cat.titleHi : cat.title}</h3>
                  <span className="rights-title-hi">{lang === 'hi' ? cat.title : cat.titleHi}</span>
                </div>
              </div>
              <p>{lang === 'hi' ? cat.descriptionHi : cat.description}</p>
              <ul className="rights-topics">
                {cat.topics.slice(0, 3).map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
                {cat.topics.length > 3 && (
                  <li style={{ color: 'var(--primary-500)', fontWeight: 600 }}>
                    +{cat.topics.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Selected Category Detail */}
      {selectedCategory && !selectedTopic && (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCategory(null)} style={{ marginBottom: '1.5rem' }}>
            ← {lang === 'hi' ? 'वापस' : 'Back to categories'}
          </button>
          
          <div className="card" style={{ '--card-color': selectedCategory.color, borderLeft: `4px solid ${selectedCategory.color}` }}>
            <div className="rights-card-header" style={{ marginBottom: '1.5rem' }}>
              <div className="rights-card-icon" style={{ background: `${selectedCategory.color}15`, color: selectedCategory.color, width: '56px', height: '56px', fontSize: '1.8rem' }}>
                {selectedCategory.icon}
              </div>
              <div>
                <h2>{lang === 'hi' ? selectedCategory.titleHi : selectedCategory.title}</h2>
                <span className="rights-title-hi" style={{ fontSize: '0.95rem' }}>{lang === 'hi' ? selectedCategory.title : selectedCategory.titleHi}</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {lang === 'hi' ? selectedCategory.descriptionHi : selectedCategory.description}
                </p>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
              {lang === 'hi' ? 'विषय चुनें — विस्तृत जानकारी प्राप्त करें' : 'Select a topic — get detailed explanation'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {selectedCategory.topics.map((topic) => (
                <button
                  key={topic}
                  className="card card-interactive"
                  style={{ padding: '1rem', textAlign: 'left', width: '100%' }}
                  onClick={() => explainTopic(topic)}
                >
                  <span style={{ color: selectedCategory.color, marginRight: '0.5rem' }}>→</span>
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Topic Explanation */}
      {selectedTopic && (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedTopic(null); setExplanation(''); }} style={{ marginBottom: '1.5rem' }}>
            ← {lang === 'hi' ? 'वापस' : 'Back to topics'}
          </button>

          <div className="card" style={{ borderLeft: `4px solid ${selectedCategory?.color || 'var(--primary-500)'}` }}>
            <h3 style={{ marginBottom: '1rem' }}>{selectedTopic}</h3>
            {loading ? (
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            ) : (
              <div className="analysis-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer lang={lang} />
    </div>
  );
}
