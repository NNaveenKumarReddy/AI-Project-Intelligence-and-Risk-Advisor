import re
import math
import uuid
from typing import List, Dict, Any, Tuple
from collections import Counter

class RAGVectorStore:
    """
    RAG Pipeline: Chunking, Embedding Generation, Vector Store Indexing,
    and High-Speed Semantic Vector Retrieval.
    """
    
    def __init__(self, chunk_size: int = 400, overlap: int = 80):
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.chunks: List[Dict[str, Any]] = []
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.vocab: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self._is_indexed = False

    def add_document(self, doc_data: Dict[str, Any]) -> int:
        """
        Adds a parsed document, splits it into chunks, and stores chunk metadata.
        """
        filename = doc_data["filename"]
        raw_text = doc_data["raw_text"]
        doc_type = doc_data["doc_type"]
        
        self.documents[filename] = doc_data
        
        # Perform chunking
        raw_chunks = self._chunk_text(raw_text, self.chunk_size, self.overlap)
        
        added_count = 0
        for i, chunk_str in enumerate(raw_chunks):
            if not chunk_str.strip():
                continue
            chunk_id = f"{filename}_chunk_{i}_{uuid.uuid4().hex[:6]}"
            chunk_entry = {
                "id": chunk_id,
                "filename": filename,
                "doc_type": doc_type,
                "chunk_index": i,
                "text": chunk_str.strip(),
                "word_count": len(chunk_str.split())
            }
            self.chunks.append(chunk_entry)
            added_count += 1
            
        self._reindex_vector_space()
        return added_count

    def _chunk_text(self, text: str, chunk_size: int, overlap: int) -> List[str]:
        """
        Recursive character chunking respecting paragraph and sentence boundaries.
        """
        # Split by double newline or single newline first
        paragraphs = re.split(r'\n\s*\n', text)
        chunks = []
        current_chunk = ""
        
        for p in paragraphs:
            p = p.strip()
            if not p:
                continue
            if len(current_chunk) + len(p) <= chunk_size:
                current_chunk = (current_chunk + "\n\n" + p).strip() if current_chunk else p
            else:
                if current_chunk:
                    chunks.append(current_chunk)
                # If paragraph itself exceeds chunk_size, split by sentences
                if len(p) > chunk_size:
                    sentences = re.split(r'(?<=[.!?])\s+', p)
                    sub_chunk = ""
                    for s in sentences:
                        if len(sub_chunk) + len(s) <= chunk_size:
                            sub_chunk = (sub_chunk + " " + s).strip() if sub_chunk else s
                        else:
                            if sub_chunk:
                                chunks.append(sub_chunk)
                            sub_chunk = s
                    if sub_chunk:
                        chunks.append(sub_chunk)
                    current_chunk = ""
                else:
                    current_chunk = p
                    
        if current_chunk:
            chunks.append(current_chunk)
            
        return chunks

    def _tokenize(self, text: str) -> List[str]:
        words = re.findall(r'\b[a-zA-Z0-9_-]+\b', text.lower())
        # Add character bi-grams/tri-grams for partial matching
        tokens = list(words)
        for w in words:
            if len(w) > 4:
                tokens.append(w[:4])
        return tokens

    def _reindex_vector_space(self):
        """
        Builds Term Frequency - Inverse Document Frequency (TF-IDF) vector representations.
        """
        num_docs = len(self.chunks)
        if num_docs == 0:
            return
            
        doc_freqs = Counter()
        for chunk in self.chunks:
            tokens = set(self._tokenize(chunk["text"]))
            for t in tokens:
                doc_freqs[t] += 1
                
        self.idf = {}
        for token, count in doc_freqs.items():
            self.idf[token] = math.log((1 + num_docs) / (1 + count)) + 1.0
            
        # Generate normalized vector embeddings for each chunk
        for chunk in self.chunks:
            tokens = self._tokenize(chunk["text"])
            tf = Counter(tokens)
            vec = {}
            norm_sq = 0.0
            for t, count in tf.items():
                tfidf_val = count * self.idf.get(t, 1.0)
                vec[t] = tfidf_val
                norm_sq += tfidf_val ** 2
            norm = math.sqrt(norm_sq) or 1.0
            chunk["vector"] = {t: val / norm for t, val in vec.items()}
            
        self._is_indexed = True

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Searches knowledge base chunks for highest cosine similarity scores to query.
        """
        if not self.chunks:
            return []
            
        query_tokens = self._tokenize(query)
        tf = Counter(query_tokens)
        query_vec = {}
        norm_sq = 0.0
        for t, count in tf.items():
            val = count * self.idf.get(t, 1.0)
            query_vec[t] = val
            norm_sq += val ** 2
        norm = math.sqrt(norm_sq) or 1.0
        query_vec = {t: val / norm for t, val in query_vec.items()}
        
        results = []
        for chunk in self.chunks:
            chunk_vec = chunk.get("vector", {})
            # Compute Cosine Similarity
            similarity = sum(val * chunk_vec.get(t, 0.0) for t, val in query_vec.items())
            
            # Boost score if query exact words appear in text
            query_lower = query.lower()
            if any(w in chunk["text"].lower() for w in query_lower.split() if len(w) > 3):
                similarity += 0.05
                
            results.append({
                "chunk": chunk,
                "score": round(similarity, 4)
            })
            
        results.sort(key=lambda x: x["score"], reverse=True)
        
        top_results = []
        for r in results[:top_k]:
            c = r["chunk"]
            top_results.append({
                "id": c["id"],
                "filename": c["filename"],
                "doc_type": c["doc_type"],
                "chunk_index": c["chunk_index"],
                "score": r["score"],
                "text": c["text"]
            })
            
        return top_results

    def clear(self):
        self.chunks = []
        self.documents = {}
        self.vocab = {}
        self.idf = {}
        self._is_indexed = False
