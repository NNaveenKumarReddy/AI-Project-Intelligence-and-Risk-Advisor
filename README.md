# AI Project Intelligence & Risk Advisor

An intelligent platform that ingests scattered project artifacts (PDFs, DOCX, CSVs, plain text) and builds a unified RAG-powered project knowledge base. A multi-agent analytical pipeline automatically extracts project scope, identifies risks, forecasts delivery challenges, generates missing documentation (User Stories, Risk Registers, Action Items), scores overall project health, and provides a grounded conversational assistant.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**

### 2. Running the Application

Run the application directly from the project root:

```bash
python main.py
```

Open your browser to:
👉 **http://127.0.0.1:8000**

Both the **FastAPI Backend API** and the **React Glassmorphism Web Interface** will be active and connected on port `8000`.

---

## 🛠️ Project Architecture & Modules

1. **Document Ingestion Module (`backend/ingestion/parser.py`)**
   - Supports `.pdf`, `.docx`, `.csv`, `.txt`, and `.md` uploads with structural metadata extraction.
2. **RAG Vector Store Pipeline (`backend/rag/vector_store.py`)**
   - Recursive character chunking, TF-IDF vector embeddings, and cosine similarity indexing with document attribution.
3. **Multi-Agent Analytical Pipeline (`backend/agents/multi_agent.py`)**
   - **Scope Extraction Agent**: Epics, deliverables breakdown, and out-of-scope boundaries.
   - **Risk Detection & Delivery Forecasting Agent**: Risk score matrix, likelihood/impact, and delivery delay forecasts.
   - **Blocker & Action Item Agent**: Unresolved blockers, severity levels, assignees, and priority tasks.
   - **Documentation Generation Agent**: Agile User Stories with acceptance criteria, Risk Register, and Action Items.
   - **Project Health Scoring Agent**: Composite Health Index (0-100) across Schedule, Scope, Risk, and Docs.
4. **Grounded Conversational Assistant (`backend/rag/assistant.py`)**
   - Natural language Q&A strictly grounded in uploaded RAG vector chunks with clickable document citations.
   - Persona roles: **Executive**, **Scrum Master**, and **Risk Auditor**.
5. **Interactive Dashboard & Web Interface (`frontend/`)**
   - Dark glassmorphism interface built with **React, Lucide Icons, and Recharts**.

---

## 📂 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI REST API & Static File Server
│   ├── ingestion/           # Document parsing (PDF, DOCX, CSV, TXT)
│   ├── rag/                 # RAG Vector Store & Grounded Assistant
│   ├── agents/              # 5 Multi-Agent analytical modules
│   └── sample_data/         # Pre-packaged sample project artifacts
├── frontend/
│   ├── src/                 # React components & glassmorphism design system
│   └── dist/                # Production build assets
├── main.py                  # Root entrypoint (`python main.py`)
└── README.md
```
