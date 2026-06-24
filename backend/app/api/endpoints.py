from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from typing import List, Dict
from app.services.forensic_analyzer import ForensicAnalyzer
from app.services.log_parser import LogParser

router = APIRouter()
DATA_DIR = "data/uploads"
analyzer = ForensicAnalyzer()
parser = LogParser()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(DATA_DIR, f"{file_id}_{file.filename}")
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
    
    return {"id": file_id, "filename": file.filename, "status": "uploaded"}

@router.post("/analyze")
async def analyze_logs(file_info: Dict):
    file_id = file_info.get("id")
    if not file_id:
        raise HTTPException(status_code=400, detail="Missing file ID")
    
    # Find the file in the upload directory
    files = os.listdir(DATA_DIR)
    target_file = next((f for f in files if f.startswith(file_id)), None)
    
    if not target_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(DATA_DIR, target_file)
    
    try:
        # Parse the log file
        df = parser.parse(file_path)
        
        # Analyze using ML model
        results = analyzer.analyze(df)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/report/{id}")
async def get_report(id: str):
    # This would typically fetch from a database, but for now we'll simulate
    return {"id": id, "summary": "Forensic findings summary...", "status": "completed"}
