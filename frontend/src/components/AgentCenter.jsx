import React, { useState } from 'react';
import { Target, AlertTriangle, AlertOctagon, FileCheck, Copy, Download, Check, Shield, Layers, UserCheck } from 'lucide-react';

export default function AgentCenter({ analysis }) {
  const [subTab, setSubTab] = useState('scope');
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!analysis) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No intelligence analysis available. Please ingest project documents first.</p>
      </div>
    );
  }

  const { scope, risks_and_forecast, blockers_and_actions, generated_docs } = analysis;

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadCSV = (filename, content) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Sub-tab Navigation */}
      <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {[
          { id: 'scope', label: 'Scope & Deliverables', icon: Target },
          { id: 'risks', label: 'Risk & Delivery Forecast', icon: AlertTriangle },
          { id: 'blockers', label: 'Blockers & Action Items', icon: AlertOctagon },
          { id: 'docs', label: 'Generated Documentation', icon: FileCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                padding: '10px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. Scope & Deliverables Sub-tab */}
      {subTab === 'scope' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Epics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {scope.epics?.map((epic, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-medium">{epic.epic_id}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{epic.items_count} Items</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{epic.title}</h4>
              </div>
            ))}
          </div>

          {/* Deliverables Table */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Extracted Deliverables & Scope Items</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '12px 16px' }}>ID</th>
                    <th style={{ padding: '12px 16px' }}>Deliverable Description</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scope.deliverables?.map((deliv, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>{deliv.id}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{deliv.title}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{deliv.category}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge badge-${deliv.status === 'Completed' ? 'healthy' : deliv.status === 'At Risk' ? 'critical' : 'medium'}`}>
                          {deliv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Out of Scope Boundaries */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#f43f5e' }}>Out of Scope Boundaries</h3>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-sub)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {scope.out_of_scope?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* 2. Risk Detection & Delivery Forecast Sub-tab */}
      {subTab === 'risks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle color="var(--accent-amber)" /> Identified Project Risks & Schedule Delay Matrix
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '12px 16px' }}>Risk ID</th>
                    <th style={{ padding: '12px 16px' }}>Risk Title</th>
                    <th style={{ padding: '12px 16px' }}>Likelihood</th>
                    <th style={{ padding: '12px 16px' }}>Impact</th>
                    <th style={{ padding: '12px 16px' }}>Forecast Delay</th>
                    <th style={{ padding: '12px 16px' }}>Mitigation Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {risks_and_forecast.risks?.map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent-amber)' }}>{r.id}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{r.title}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge badge-${r.likelihood.toLowerCase()}`}>{r.likelihood}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge badge-${r.impact.toLowerCase()}`}>{r.impact}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#f43f5e' }}>{r.forecasted_delay}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-sub)', fontSize: '0.82rem' }}>{r.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3. Blockers & Action Items Sub-tab */}
      {subTab === 'blockers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Active Blockers */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: '#f43f5e' }}>Active Unresolved Blockers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {blockers_and_actions.blockers?.map((blk, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span className="badge badge-critical">{blk.id}</span>
                      <strong style={{ fontSize: '0.95rem' }}>{blk.description}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Impact Area: {blk.impact_area} • Assigned Owner: <strong style={{ color: 'var(--text-main)' }}>{blk.owner}</strong>
                    </div>
                  </div>
                  <span className={`badge badge-${blk.status === 'OPEN' ? 'critical' : 'medium'}`}>{blk.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Action Items Tracker</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '12px 16px' }}>ID</th>
                    <th style={{ padding: '12px 16px' }}>Action Task</th>
                    <th style={{ padding: '12px 16px' }}>Assigned To</th>
                    <th style={{ padding: '12px 16px' }}>Priority</th>
                    <th style={{ padding: '12px 16px' }}>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {blockers_and_actions.action_items?.map((act, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>{act.id}</td>
                      <td style={{ padding: '14px 16px' }}>{act.task}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-sub)' }}>{act.assigned_to}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge badge-${act.priority.toLowerCase()}`}>{act.priority}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{act.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 4. Generated Documentation Artifacts Sub-tab */}
      {subTab === 'docs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Auto-Generated Project Documentation</h3>
            <button
              onClick={() => {
                const csvRows = ['Risk_ID,Category,Description,Likelihood,Impact,Mitigation'];
                generated_docs.risk_register?.forEach(r => csvRows.push(`"${r.risk_id}","${r.category}","${r.description}","${r.likelihood}","${r.impact}","${r.mitigation_strategy}"`));
                downloadCSV('Project_Risk_Register.csv', csvRows.join('\n'));
              }}
              className="btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <Download size={14} /> Export Risk Register CSV
            </button>
          </div>

          {/* User Stories Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {generated_docs.user_stories?.map((us, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-medium" style={{ fontSize: '0.8rem' }}>{us.id}</span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{us.title}</h4>
                  </div>
                  <button onClick={() => copyToClipboard(JSON.stringify(us, null, 2), idx)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    {copiedIndex === idx ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    {copiedIndex === idx ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                
                <div className="glass-panel" style={{ padding: '14px 18px', marginBottom: '14px', fontSize: '0.9rem', lineHeight: '1.5', fontStyle: 'italic', color: '#cbd5e1' }}>
                  "{us.user_story}"
                </div>

                <div style={{ fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>Acceptance Criteria (Given / When / Then):</strong>
                  <ul style={{ paddingLeft: '20px', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {us.acceptance_criteria?.map((ac, cIdx) => (
                      <li key={cIdx}>{ac}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
