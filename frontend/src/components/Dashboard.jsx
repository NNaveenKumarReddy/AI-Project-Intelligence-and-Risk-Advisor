import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, FileText, ArrowRight, Zap, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard({ analysis, healthData, onNavigate }) {
  if (!analysis || !healthData) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>No Analysis Data Available</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Load sample project data or upload project documents to generate intelligence insights.</p>
      </div>
    );
  }

  const { overall_score, status_label, color_theme, dimensions, recommendations } = healthData;
  const risks = analysis.risks_and_forecast?.risks || [];
  const forecastDelay = analysis.risks_and_forecast?.overall_forecasted_delay || '0 Days';
  const blockers = analysis.blockers_and_actions?.blockers || [];
  const openBlockersCount = analysis.blockers_and_actions?.open_blockers_count || 0;

  // Chart Data
  const dimensionData = [
    { name: 'Schedule', score: dimensions.schedule_health, fill: '#6366f1' },
    { name: 'Scope Clarity', score: dimensions.scope_clarity, fill: '#06b6d4' },
    { name: 'Risk Control', score: dimensions.risk_health, fill: '#a855f7' },
    { name: 'Documentation', score: dimensions.doc_completeness, fill: '#10b981' }
  ];

  const riskDistribution = [
    { name: 'High / Critical', value: risks.filter(r => r.impact === 'High' || r.likelihood === 'High').length || 1, color: '#f43f5e' },
    { name: 'Medium Risk', value: risks.filter(r => r.impact === 'Medium' && r.likelihood !== 'High').length || 2, color: '#f59e0b' },
    { name: 'Low Risk', value: risks.filter(r => r.impact === 'Low').length || 1, color: '#10b981' }
  ];

  const gaugeColor = overall_score >= 80 ? '#10b981' : overall_score >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Forecast & Alert Banner */}
      <div className="glass-card" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={24} color="#f43f5e" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>AI Forecasted Delivery Delay</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{forecastDelay}</span>
                <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>Delivery Alert</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="glass-panel" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Active Blockers</div>
              <strong style={{ color: '#f43f5e', fontSize: '1.1rem' }}>{openBlockersCount} Unresolved</strong>
            </div>
            <div className="glass-panel" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>High Risks Detected</div>
              <strong style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{risks.length} Total Risks</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Top Grid: Health Score Dial & Dimension Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Overall Health Score Card */}
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
            Overall Project Health Index
          </h3>
          
          {/* Circular Gauge Visual */}
          <div style={{ position: 'relative', width: '170px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="170" height="170" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="50" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke={gaugeColor}
                strokeWidth="10"
                strokeDasharray="314.15"
                strokeDashoffset={314.15 - (314.15 * overall_score) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                {overall_score}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>/ 100 Index</div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <span className={`badge badge-${color_theme}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
              {status_label}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px', maxWidth: '280px' }}>
            Calculated across Schedule, Scope, Risk Control, and Document Completeness.
          </p>
        </div>

        {/* Health Dimension Breakdown Bars */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--primary)" />
            Health Dimension Scores
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Schedule Health', score: dimensions.schedule_health, color: '#6366f1' },
              { label: 'Scope Clarity', score: dimensions.scope_clarity, color: '#06b6d4' },
              { label: 'Risk Vulnerability Control', score: dimensions.risk_health, color: '#a855f7' },
              { label: 'Documentation Completeness', score: dimensions.doc_completeness, color: '#10b981' }
            ].map((dim, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-sub)' }}>{dim.label}</span>
                  <strong style={{ color: dim.color }}>{dim.score}%</strong>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${dim.score}%`, height: '100%', background: dim.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Severity Pie Chart */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '16px', width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--accent-amber)" />
            Risk Severity Breakdown
          </h3>

          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '0.78rem', flexWrap: 'wrap' }}>
            {riskDistribution.map((r, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.color }} />
                <span style={{ color: 'var(--text-muted)' }}>{r.name} ({r.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Executive Recommendations & Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* AI Executive Recommendations */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
            AI Executive Action Plan
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map((rec, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.85rem' }}>
                <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', fontWeight: 700, borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem' }}>
                  #{idx + 1}
                </span>
                <span style={{ color: 'var(--text-sub)', lineHeight: '1.4' }}>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Intelligence Shortcuts */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '16px' }}>
            Explore Intelligence Agents
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Scope & Epics', desc: 'Requirements & status', tab: 'agents', color: '#6366f1' },
              { label: 'Risk Matrix', desc: 'Delays & evidence', tab: 'agents', color: '#f59e0b' },
              { label: 'Blocker Tracker', desc: 'Unresolved dependencies', tab: 'agents', color: '#f43f5e' },
              { label: 'Grounded Assistant', desc: 'Natural language Q&A', tab: 'chat', color: '#10b981' }
            ].map((card, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(card.tab)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: card.color, marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {card.label}
                  <ArrowRight size={14} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{card.desc}</div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
