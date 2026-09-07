import os
import sys
import uvicorn

# Add current workspace directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import FastAPI application instance from backend
from backend.main import app

if __name__ == "__main__":
    print("[+] Starting AI Project Intelligence & Risk Advisor Server...")
    print("[+] Platform UI & API live at: http://127.0.0.1:8000")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
