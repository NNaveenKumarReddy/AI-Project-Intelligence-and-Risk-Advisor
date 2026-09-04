import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DocumentHub from './components/DocumentHub';
import AgentCenter from './components/AgentCenter';
import AssistantChat from './components/AssistantChat';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Map window pathname to tab id
function getTabFromPath() {
  if (typeof window === 'undefined') return 'dashboard';
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (path === 'documents' || path === 'document-hub') return 'documents';
  if (path === 'agents' || path === 'agent-center') return 'agents';
  if (path === 'chat' || path === 'assistant') return 'chat';
  if (path === 'dashboard' || path === '') return 'dashboard';
  // Default to dashboard for any other paths (e.g. login, register, unknown routes)
  return 'dashboard';
}

export default function App() {
  const [activeTab, setActiveTab] = useState(() => getTabFromPath());
  const [documents, setDocuments] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync state when browser Back/Forward is clicked
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL and tab state
  const handleNavigate = (tab) => {
    setActiveTab(tab);
    const newPath = tab === 'dashboard' ? '/' : `/${tab}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ tab }, '', newPath);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    fetchDocumentsAndAnalysis();
  }, []);

  const fetchDocumentsAndAnalysis = async () => {
    try {
      // 1. Fetch Ingested Documents
      const docRes = await fetch(`${API_BASE}/api/documents`);
      if (docRes.ok) {
        const docData = await docRes.json();
        setDocuments(docData.documents || []);
        
        // If documents exist, run analysis
        if (docData.documents.length > 0) {
          runAnalysis();
        } else {
          // Auto load sample data for instant wow factor
          handleLoadSample();
        }
      }
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  const runAnalysis = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/analyze`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
        setHealthData(data.health_score);
      }
    } catch (err) {
      console.error('Failed to run analysis:', err);
    }
  };

  const handleUpload = async (files) => {
    setLoading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        await fetchDocumentsAndAnalysis();
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/load-sample`, { method: 'POST' });
      if (res.ok) {
        const docRes = await fetch(`${API_BASE}/api/documents`);
        const docData = await docRes.json();
        setDocuments(docData.documents || []);
        await runAnalysis();
      }
    } catch (err) {
      console.error('Failed to load sample data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch(`${API_BASE}/api/reset`, { method: 'DELETE' });
      setDocuments([]);
      setAnalysis(null);
      setHealthData(null);
      setChatHistory([]);
    } catch (err) {
      console.error('Failed to reset knowledge base:', err);
    }
  };

  const handleSendQuery = async (queryText, persona) => {
    const userMsg = { role: 'user', text: queryText };
    setChatHistory((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, persona })
      });
      if (res.ok) {
        const data = await res.json();
        const aiMsg = {
          role: 'assistant',
          text: data.answer,
          citations: data.citations || []
        };
        setChatHistory((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Chat query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalChunks = documents.reduce((acc, d) => acc + (d.chunks_count || 0), 0);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        docCount={documents.length}
        chunkCount={totalChunks}
        healthScore={healthData?.overall_score ?? null}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        loading={loading}
      />

      {/* Main Tab Container */}
      <main>
        {activeTab === 'dashboard' && (
          <Dashboard
            analysis={analysis}
            healthData={healthData}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentHub
            documents={documents}
            onUpload={handleUpload}
            onLoadSample={handleLoadSample}
            onReset={handleReset}
            loading={loading}
          />
        )}

        {activeTab === 'agents' && (
          <AgentCenter analysis={analysis} />
        )}

        {activeTab === 'chat' && (
          <AssistantChat
            onSendQuery={handleSendQuery}
            chatHistory={chatHistory}
            loading={loading}
          />
        )}
      </main>

    </div>
  );
}
