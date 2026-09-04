import React, { useState } from 'react';
import { UploadCloud, FileText, Database, Trash2, Eye, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DocumentHub({ documents, onUpload, onLoadSample, onReset, loading }) {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Upload Header & Dropzone */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Drag and Drop Zone */}
        <div
          className="glass-card"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          style={{
            padding: '36px 24px',
            textAlign: 'center',
            border: dragOver ? '2px dashed var(--primary)' : '2px dashed rgba(255, 255, 255, 0.15)',
            background: dragOver ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type="file"
            id="fileInput"
            multiple
            accept=".pdf,.docx,.csv,.txt,.md"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <UploadCloud size={30} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              Upload Project Artifacts
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', maxWidth: '320px' }}>
              Drag & drop <strong>PDF proposals, DOCX SRS, CSV task lists, or meeting notes</strong> here or click to browse.
            </p>
            <span className="btn-primary" style={{ fontSize: '0.85rem' }}>
              Select Files
            </span>
          </label>
        </div>

        {/* Quick Info & Sample Data Loader */}
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Sparkles size={22} color="#a855f7" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Instant Sample Project Data</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '18px' }}>
              Test RAG search, vector chunking, risk forecasting, and health scoring instantly with pre-configured project artifacts:
            </p>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-sub)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>FinTech Platform SRS v2.1</strong> (Scope & System Specs)</li>
              <li><strong>Sprint 14 Retrospective Notes</strong> (Delays & Blockers)</li>
              <li><strong>Jira Backlog Export CSV</strong> (Task Priority Matrix)</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={onLoadSample} className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' }}>
              <Sparkles size={16} />
              {loading ? 'Processing RAG...' : 'Load Sample Project Artifacts'}
            </button>
          </div>
        </div>

      </div>

      {/* Ingested Documents List Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Ingested Knowledge Base Artifacts ({documents.length})
            </h3>
          </div>
          {documents.length > 0 && (
            <button onClick={onReset} className="btn-secondary" style={{ fontSize: '0.8rem', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
              <Trash2 size={14} /> Clear Knowledge Base
            </button>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <AlertCircle size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No project documents ingested yet. Upload files above or click <strong>'Load Sample Project Artifacts'</strong> to begin.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Document Name</th>
                  <th style={{ padding: '12px 16px' }}>Type</th>
                  <th style={{ padding: '12px 16px' }}>Words</th>
                  <th style={{ padding: '12px 16px' }}>Vector Chunks</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={18} color="var(--primary)" />
                      <span>{doc.filename}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-medium" style={{ fontSize: '0.7rem' }}>
                        {doc.doc_type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-sub)' }}>{doc.word_count} words</td>
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ color: 'var(--accent-cyan)' }}>{doc.chunks_count} chunks</strong>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Indexed
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button onClick={() => setSelectedDoc(doc)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                        <Eye size={14} /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Preview Drawer/Modal */}
      {selectedDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '700px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedDoc.filename}</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Close</button>
            </div>
            <div className="glass-panel" style={{ padding: '16px', overflowY: 'auto', flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.82rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-sub)' }}>
              {selectedDoc.preview_text}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
