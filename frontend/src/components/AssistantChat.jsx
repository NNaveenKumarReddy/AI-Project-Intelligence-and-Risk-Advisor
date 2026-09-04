import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot, BookOpen, ChevronRight, HelpCircle, UserCheck } from 'lucide-react';

export default function AssistantChat({ onSendQuery, chatHistory, loading }) {
  const [inputQuery, setInputQuery] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('Executive');
  const [activeCitationModal, setActiveCitationModal] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;
    onSendQuery(inputQuery, selectedPersona);
    setInputQuery('');
  };

  const handleSuggestedClick = (promptText) => {
    onSendQuery(promptText, selectedPersona);
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: '560px' }}>
      
      {/* Header & Persona Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', pb: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={22} color="var(--primary)" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Grounded Conversational Assistant</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Answers strictly grounded in RAG document evidence</p>
          </div>
        </div>

        {/* Persona Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Persona:</span>
          {['Executive', 'Scrum Master', 'Risk Auditor'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPersona(p)}
              style={{
                background: selectedPersona === p ? 'var(--primary)' : 'rgba(30, 41, 59, 0.7)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: selectedPersona === p ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', paddingRight: '6px', marginBottom: '16px' }}>
        {chatHistory.length === 0 ? (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', margin: 'auto', maxWidth: '480px' }}>
            <HelpCircle size={40} color="var(--primary)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Ask Project Intelligence Anything</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Query project status, delivery forecasts, risks, or open action items grounded in uploaded documents.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                "What are the top 3 schedule risk factors?",
                "List all unresolved critical blockers and their owners.",
                "What project scope deliverables are currently at risk?",
                "Summarize our project health score breakdown."
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedClick(suggestion)}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', justifyContent: 'flex-start', textAlign: 'left' }}
                >
                  <ChevronRight size={14} color="var(--primary)" /> {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '14px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              {/* Avatar */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.role === 'user' ? <User size={18} color="#fff" /> : <Bot size={18} color="#fff" />}
              </div>

              {/* Bubble Content */}
              <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  className="glass-panel"
                  style={{
                    padding: '14px 18px',
                    borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: msg.role === 'user' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                    borderColor: msg.role === 'user' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                </div>

                {/* Grounded Citation Badges */}
                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={12} /> Sources:
                    </span>
                    {msg.citations.map((cit, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => setActiveCitationModal(cit)}
                        className="badge badge-medium"
                        style={{ cursor: 'pointer', fontSize: '0.68rem', padding: '2px 8px' }}
                      >
                        {cit.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Bot size={18} color="var(--primary)" className="pulse" />
            <span>Retrieving knowledge base vector chunks & synthesizing grounded answer...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', pt: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask about project scope, risks, blockers (${selectedPersona} persona)...`}
          disabled={loading}
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#ffffff',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button type="submit" className="btn-primary" disabled={loading || !inputQuery.trim()}>
          <Send size={16} /> Send
        </button>
      </form>

      {/* Citation Snippet Evidence Popover Modal */}
      {activeCitationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--accent-cyan)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>RAG Citation Evidence</h4>
              </div>
              <button onClick={() => setActiveCitationModal(null)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>Close</button>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Document: <strong>{activeCitationModal.filename}</strong> (Chunk #{activeCitationModal.chunk_index + 1}) • Match Score: {(activeCitationModal.score * 100).toFixed(1)}%
            </div>
            <div className="glass-panel" style={{ padding: '14px', fontSize: '0.85rem', color: 'var(--text-sub)', fontStyle: 'italic', lineHeight: '1.6' }}>
              "{activeCitationModal.snippet}"
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
