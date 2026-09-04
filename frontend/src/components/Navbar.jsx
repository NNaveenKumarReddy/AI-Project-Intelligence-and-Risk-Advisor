import React from 'react';
import { ShieldAlert, Database, RefreshCw, FolderPlus, Sparkles, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, docCount, chunkCount, healthScore, onLoadSample, onReset, loading }) {
  const scoreColor = healthScore >= 80 ? '#10b981' : healthScore >= 50 ? '#f59e0b' : '#f43f5e';
  const statusText = healthScore >= 80 ? 'HEALTHY' : healthScore >= 50 ? 'MODERATE RISK' : 'CRITICAL RISK';

  return (
    <header className="glass-card" style={{ borderRadius: '0 0 16px 16px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '16px 28px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <ShieldAlert size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
                AI Project Intelligence & Risk Advisor
              </h1>
              <span className="badge badge-medium" style={{ fontSize: '0.65rem' }}>RAG Multi-Agent 1.0</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Unified RAG Knowledge Base • Multi-Agent Risk Forecasting • Grounded Assistant
            </p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          
          {/* Health Metric Indicator */}
          {healthScore !== null && (
            <div className="glass-panel" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={18} color={scoreColor} />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Project Health</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: scoreColor }}>
                  {healthScore}/100 <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>({statusText})</span>
                </div>
              </div>
            </div>
          )}

          {/* Document Stats Pill */}
          <div className="glass-panel" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
            <Database size={16} color="var(--accent-cyan)" />
            <span><strong style={{ color: 'var(--text-main)' }}>{docCount}</strong> Docs ({chunkCount} Chunks)</span>
          </div>

          {/* Action Buttons */}
          <button onClick={onLoadSample} className="btn-secondary" disabled={loading} style={{ fontSize: '0.82rem', padding: '8px 14px' }}>
            <Sparkles size={16} color="#a855f7" />
            {loading ? 'Processing...' : 'Load Sample Data'}
          </button>

          <button onClick={onReset} className="btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 12px', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
            <RefreshCw size={14} />
            Reset Base
          </button>

        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '8px', marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
        {[
          { id: 'dashboard', label: 'Executive Dashboard', icon: Activity },
          { id: 'documents', label: 'Document Ingestion Hub', icon: FolderPlus },
          { id: 'agents', label: 'Multi-Agent Intelligence', icon: ShieldAlert },
          { id: 'chat', label: 'Conversational Assistant', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.88rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
