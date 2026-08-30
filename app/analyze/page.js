'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Footer from '../components/Footer';

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'paste'
  const [lang, setLang] = useState('en');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('nyayasetu-lang') || 'en';
    setLang(saved);
    const handler = (e) => setLang(e.detail);
    window.addEventListener('langChange', handler);
    return () => window.removeEventListener('langChange', handler);
  }, []);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setTextContent(e.target.result);
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const analyzeDocument = async () => {
    if (!textContent.trim()) return;
    setLoading(true);
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: textContent,
          fileType: file?.type || 'text/plain',
          language: lang,
        }),
      });

      const data = await response.json();
      setAnalysis(data.response || data.error || 'Failed to analyze document.');
    } catch (error) {
      setAnalysis('⚠️ **Error**: Could not connect to the analysis server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setTextContent('');
    setAnalysis('');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="section-header">
        <h2>{lang === 'hi' ? '📄 दस्तावेज़ विश्लेषक' : '📄 Document Analyzer'}</h2>
        <p className="section-title-hi">{lang === 'hi' ? 'अपने कानूनी दस्तावेज़ का एआई विश्लेषण प्राप्त करें' : 'दस्तावेज़ विश्लेषक'}</p>
        <p>
          {lang === 'hi'
            ? 'अपना कानूनी दस्तावेज़ अपलोड करें या पेस्ट करें। एआई इसका विश्लेषण करेगा और सारांश, मुख्य बिंदु, जोखिम मूल्यांकन प्रदान करेगा।'
            : 'Upload or paste your legal document. AI will analyze it and provide a summary, key points, risk assessment, and simplified explanation.'}
        </p>
      </div>

      {!analysis && (
        <>
          {/* Input mode toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              className={`btn ${inputMode === 'upload' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setInputMode('upload')}
            >
              <Upload size={14} /> {lang === 'hi' ? 'अपलोड करें' : 'Upload File'}
            </button>
            <button
              className={`btn ${inputMode === 'paste' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setInputMode('paste')}
            >
              <FileText size={14} /> {lang === 'hi' ? 'टेक्स्ट पेस्ट करें' : 'Paste Text'}
            </button>
          </div>

          {inputMode === 'upload' ? (
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf,.rtf"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              <div className="upload-icon">
                <Upload size={24} />
              </div>
              {file ? (
                <>
                  <h3 style={{ color: 'var(--success)' }}>
                    <CheckCircle size={18} style={{ display: 'inline', verticalAlign: 'middle' }} /> {file.name}
                  </h3>
                  <p>{(file.size / 1024).toFixed(1)} KB — {lang === 'hi' ? 'विश्लेषण के लिए तैयार' : 'Ready to analyze'}</p>
                </>
              ) : (
                <>
                  <h3>{lang === 'hi' ? 'फ़ाइल यहाँ ड्रैग करें या क्लिक करें' : 'Drag & drop your file or click to browse'}</h3>
                  <p>{lang === 'hi' ? 'समर्थित प्रारूप: TXT, DOC, DOCX, PDF, RTF' : 'Supported formats: TXT, DOC, DOCX, PDF, RTF'}</p>
                  <div className="upload-formats">
                    {['TXT', 'DOC', 'PDF', 'RTF'].map(fmt => (
                      <span key={fmt} className="format-badge">{fmt}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">
                {lang === 'hi' ? 'दस्तावेज़ का टेक्स्ट यहाँ पेस्ट करें' : 'Paste document text below'}
              </label>
              <textarea
                className="form-input form-textarea"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder={lang === 'hi' ? 'अपने कानूनी दस्तावेज़ का टेक्स्ट यहाँ पेस्ट करें...' : 'Paste your legal document text here...'}
                style={{ minHeight: '200px' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={analyzeDocument}
              disabled={!textContent.trim() || loading}
            >
              {loading ? (
                <><Loader2 size={18} className="spinning" /> {lang === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing...'}</>
              ) : (
                <><FileText size={18} /> {lang === 'hi' ? 'विश्लेषण करें' : 'Analyze Document'}</>
              )}
            </button>
          </div>
        </>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="analysis-results">
          <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary-500)' }}>
            <div className="analysis-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={resetAll}>
              {lang === 'hi' ? '🔄 नया दस्तावेज़ विश्लेषण करें' : '🔄 Analyze Another Document'}
            </button>
            <button className="btn btn-ghost" onClick={() => navigator.clipboard.writeText(analysis)}>
              {lang === 'hi' ? '📋 कॉपी करें' : '📋 Copy Analysis'}
            </button>
          </div>
        </div>
      )}

      <Footer lang={lang} />
    </div>
  );
}
