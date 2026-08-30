'use client';

import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, ArrowRight, Download, Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DOCUMENT_TEMPLATES } from '../lib/constants';
import Footer from '../components/Footer';

export default function GeneratePage() {
  const [step, setStep] = useState(1); // 1: Choose template, 2: Fill details, 3: Generated
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('nyayasetu-lang') || 'en';
    setLang(saved);
    const handler = (e) => setLang(e.detail);
    window.addEventListener('langChange', handler);
    return () => window.removeEventListener('langChange', handler);
  }, []);

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    const initialData = {};
    template.fields.forEach(field => { initialData[field] = ''; });
    setFormData(initialData);
    setStep(2);
  };

  const generateDocument = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: selectedTemplate.title,
          fields: formData,
          language: lang,
        }),
      });
      const data = await response.json();
      setGeneratedDoc(data.response || 'Failed to generate document.');
      setStep(3);
    } catch (error) {
      setGeneratedDoc('⚠️ Error generating document. Please try again.');
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = () => {
    const blob = new Blob([generatedDoc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.id || 'document'}_nyayasetu.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setStep(1);
    setSelectedTemplate(null);
    setFormData({});
    setGeneratedDoc('');
  };

  return (
    <div className="wizard-container">
      <div className="section-header">
        <h2>{lang === 'hi' ? '📝 कानूनी दस्तावेज़ जनरेटर' : '📝 Legal Document Generator'}</h2>
        <p className="section-title-hi">{lang === 'hi' ? 'एआई की मदद से कानूनी दस्तावेज़ प्रारूप बनाएं' : 'कानूनी दस्तावेज़ जनरेटर'}</p>
      </div>

      {/* Wizard Steps */}
      <div className="wizard-steps">
        {[
          { num: 1, label: lang === 'hi' ? 'प्रकार चुनें' : 'Choose Type' },
          { num: 2, label: lang === 'hi' ? 'विवरण भरें' : 'Fill Details' },
          { num: 3, label: lang === 'hi' ? 'दस्तावेज़' : 'Document' },
        ].map((s, i) => (
          <div key={s.num} className="wizard-step">
            <div className={`wizard-step-dot ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span style={{ fontSize: '0.8rem', color: step >= s.num ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: step === s.num ? 600 : 400 }}>
              {s.label}
            </span>
            {i < 2 && <div className={`wizard-step-line ${step > s.num ? 'completed' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div className="template-grid">
          {DOCUMENT_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="card card-interactive template-card"
              onClick={() => selectTemplate(template)}
            >
              <div className="template-icon">{template.icon}</div>
              <h4>{lang === 'hi' ? template.titleHi : template.title}</h4>
              <p className="template-title-hi">{lang === 'hi' ? template.title : template.titleHi}</p>
              <p>{template.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Fill Details */}
      {step === 2 && selectedTemplate && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedTemplate.icon} {lang === 'hi' ? selectedTemplate.titleHi : selectedTemplate.title}
          </h3>

          {selectedTemplate.fields.map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">{field}</label>
              {field.toLowerCase().includes('details') || field.toLowerCase().includes('description') || field.toLowerCase().includes('statement') || field.toLowerCase().includes('facts') || field.toLowerCase().includes('grounds') || field.toLowerCase().includes('information sought') ? (
                <textarea
                  className="form-input form-textarea"
                  value={formData[field] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={`Enter ${field.toLowerCase()}...`}
                />
              ) : (
                <input
                  type={field.toLowerCase().includes('date') ? 'date' : field.toLowerCase().includes('amount') || field.toLowerCase().includes('rent') || field.toLowerCase().includes('deposit') ? 'number' : 'text'}
                  className="form-input"
                  value={formData[field] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={`Enter ${field.toLowerCase()}...`}
                />
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              <ArrowLeft size={16} /> {lang === 'hi' ? 'वापस' : 'Back'}
            </button>
            <button className="btn btn-primary" onClick={generateDocument} disabled={loading}>
              {loading ? (
                <><Loader2 size={16} /> {lang === 'hi' ? 'बना रहे हैं...' : 'Generating...'}</>
              ) : (
                <><FileText size={16} /> {lang === 'hi' ? 'दस्तावेज़ बनाएं' : 'Generate Document'}</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generated Document */}
      {step === 3 && (
        <div>
          <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--success)' }}>
                ✅ {lang === 'hi' ? 'दस्तावेज़ तैयार है' : 'Document Generated'}
              </h3>
            </div>
            <div className="analysis-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedDoc}</ReactMarkdown>
            </div>
          </div>

          <div className="document-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={resetAll}>
              {lang === 'hi' ? '🔄 नया दस्तावेज़' : '🔄 New Document'}
            </button>
            <button className="btn btn-ghost" onClick={handleCopy}>
              {copied ? <><Check size={16} /> {lang === 'hi' ? 'कॉपी हो गया' : 'Copied!'}</> : <><Copy size={16} /> {lang === 'hi' ? 'कॉपी करें' : 'Copy'}</>}
            </button>
            <button className="btn btn-primary" onClick={downloadDocument}>
              <Download size={16} /> {lang === 'hi' ? 'डाउनलोड करें' : 'Download'}
            </button>
          </div>
        </div>
      )}

      <Footer lang={lang} />
    </div>
  );
}
