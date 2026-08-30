'use client';

export default function Footer({ lang = 'en' }) {
  return (
    <footer className="footer">
      <p className="footer-disclaimer">
        <strong>⚠️ {lang === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}:</strong>{' '}
        {lang === 'hi'
          ? 'न्यायसेतु कानूनी जानकारी प्रदान करता है, कानूनी सलाह नहीं। विशिष्ट कानूनी मामलों के लिए कृपया योग्य वकील से परामर्श करें।'
          : 'NyayaSetu provides legal information, not legal advice. Please consult a qualified lawyer for specific legal matters.'}
      </p>
      <div className="footer-links">
        <a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer">NALSA</a>
        <a href="https://indiankanoon.org" target="_blank" rel="noopener noreferrer">Indian Kanoon</a>
        <a href="https://ecourts.gov.in" target="_blank" rel="noopener noreferrer">e-Courts</a>
      </div>
    </footer>
  );
}
