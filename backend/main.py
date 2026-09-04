import sys
import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Ensure backend modules are importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.ingestion.parser import DocumentParser
from backend.rag.vector_store import RAGVectorStore
from backend.agents.multi_agent import ProjectIntelligencePipeline
from backend.rag.assistant import ConversationalAssistant
from backend.sample_data.generator import SampleDataGenerator

app = FastAPI(
    title="AI Project Intelligence & Risk Advisor API",
    description="Multi-Agent Project Intelligence, RAG Vector Search, Risk Forecasting & Health Scoring Engine",
    version="1.0.0"
)

# Enable CORS for local Vite dev server and browser interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State Instances
vector_store = RAGVectorStore(chunk_size=450, overlap=80)
pipeline = ProjectIntelligencePipeline(vector_store)
assistant = ConversationalAssistant(vector_store)

class ChatRequest(BaseModel):
    query: str
    persona: Optional[str] = "Executive"

# Serve static frontend dist if built
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse
    
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/", response_class=FileResponse)
    def serve_frontend():
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "status": "online",
            "app": "AI Project Intelligence & Risk Advisor",
            "documents_ingested": len(vector_store.documents),
            "chunks_indexed": len(vector_store.chunks)
        }

@app.post("/api/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Ingests PDF, DOCX, CSV, or Text project documents into the RAG Knowledge Base.
    """
    results = []
    for file in files:
        content = await file.read()
        try:
            doc_data = DocumentParser.parse_file(content, file.filename)
            chunks_added = vector_store.add_document(doc_data)
            results.append({
                "filename": file.filename,
                "doc_type": doc_data["doc_type"],
                "word_count": doc_data["word_count"],
                "line_count": doc_data["line_count"],
                "chunks_indexed": chunks_added,
                "status": "Success"
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "status": "Error",
                "error": str(e)
            })
            
    return {
        "message": f"Successfully processed {len(results)} document(s)",
        "documents": results,
        "total_knowledge_base_chunks": len(vector_store.chunks)
    }

@app.post("/api/load-sample")
def load_sample_project_data():
    """
    Loads ready-to-use sample project artifacts (SRS, Meeting Notes, Backlog CSV) into RAG knowledge base.
    """
    sample_files = SampleDataGenerator.get_sample_files()
    results = []
    
    for item in sample_files:
        filename = item["filename"]
        content_bytes = item["bytes"]
        doc_data = DocumentParser.parse_file(content_bytes, filename)
        chunks_added = vector_store.add_document(doc_data)
        results.append({
            "filename": filename,
            "doc_type": doc_data["doc_type"],
            "word_count": doc_data["word_count"],
            "chunks_indexed": chunks_added
        })
        
    return {
        "message": "Sample FinTech Project Knowledge Base successfully loaded!",
        "documents": results,
        "total_chunks_indexed": len(vector_store.chunks)
    }

@app.get("/api/documents")
def list_documents():
    """
    Lists all ingested documents and their chunk stats.
    """
    docs = []
    for fn, data in vector_store.documents.items():
        doc_chunks = [c for c in vector_store.chunks if c["filename"] == fn]
        docs.append({
            "filename": fn,
            "doc_type": data["doc_type"],
            "word_count": data["word_count"],
            "file_size_bytes": data.get("file_size_bytes", 0),
            "chunks_count": len(doc_chunks),
            "preview_text": data["raw_text"][:300] + "..."
        })
    return {
        "documents": docs,
        "total_documents": len(docs),
        "total_chunks": len(vector_store.chunks)
    }

@app.post("/api/analyze")
def run_multi_agent_analysis():
    """
    Triggers all 5 agents (Scope, Risk, Blockers, Documentation, Health Scorer)
    and returns comprehensive project intelligence summary.
    """
    if not vector_store.chunks:
        # Auto-load sample data if empty so user gets instant value
        load_sample_project_data()
        
    analysis_result = pipeline.run_full_analysis()
    return analysis_result

@app.post("/api/chat")
def answer_project_query(req: ChatRequest):
    """
    Grounded Conversational Project Assistant. Answers queries using RAG context with citations.
    """
    if not vector_store.chunks:
        load_sample_project_data()
        
    response = assistant.answer_query(req.query, req.persona)
    return response

@app.get("/api/health-score")
def get_health_score():
    """
    Returns real-time calculated Project Health Score & metric gauges.
    """
    if not vector_store.chunks:
        load_sample_project_data()
        
    analysis = pipeline.run_full_analysis()
    return analysis["health_score"]

@app.delete("/api/reset")
def reset_knowledge_base():
    """
    Clears all documents and vector chunks from the knowledge base.
    """
    vector_store.clear()
    return {"message": "Project Knowledge Base cleared successfully."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
