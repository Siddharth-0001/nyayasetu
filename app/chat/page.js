'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import LoadingDots from '../components/LoadingDots';
import { SUGGESTED_QUESTIONS } from '../lib/constants';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('nyayasetu-lang') || 'en';
    setLang(saved);
    const handler = (e) => setLang(e.detail);
    window.addEventListener('langChange', handler);
    return () => window.removeEventListener('langChange', handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages,
          language: lang,
        }),
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.response || data.error || 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ **Connection Error**\n\nCould not reach the server. Please check your internet connection and try again.',
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-container">
      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
            <h2>{lang === 'hi' ? 'न्यायसेतु में आपका स्वागत है' : 'Welcome to NyayaSetu'}</h2>
            <p>
              {lang === 'hi'
                ? 'मुझसे भारतीय कानून के बारे में कोई भी प्रश्न पूछें। मैं आपके अधिकारों को सरल भाषा में समझाने में मदद करूंगा।'
                : 'Ask me any question about Indian law. I\'ll help you understand your rights in simple language.'}
            </p>

            {SUGGESTED_QUESTIONS.map((category) => (
              <div key={category.category} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                  {category.icon} {category.category}
                </div>
                <div className="suggested-questions">
                  {category.questions.map((q) => (
                    <button
                      key={q}
                      className="suggested-question"
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {loading && <LoadingDots />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'hi' ? 'अपना कानूनी प्रश्न यहाँ टाइप करें...' : 'Type your legal question here...'}
            rows={1}
            disabled={loading}
          />
          <div className="chat-input-actions">
            {messages.length > 0 && (
              <button className="btn-ghost btn-icon" onClick={clearChat} title="Clear chat">
                <Trash2 size={16} />
              </button>
            )}
            <button
              className="send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <p className="chat-disclaimer">
          {lang === 'hi'
            ? '⚠️ न्यायसेतु कानूनी जानकारी प्रदान करता है, कानूनी सलाह नहीं। विशिष्ट मामलों के लिए वकील से परामर्श करें।'
            : '⚠️ NyayaSetu provides legal information, not legal advice. Consult a lawyer for specific cases.'}
        </p>
      </div>
    </div>
  );
}
