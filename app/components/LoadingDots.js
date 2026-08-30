'use client';

export default function LoadingDots() {
  return (
    <div className="message assistant">
      <div className="message-avatar assistant">⚖️</div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-name">NyayaSetu</span>
        </div>
        <div className="message-body">
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
