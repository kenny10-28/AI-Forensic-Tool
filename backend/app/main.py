from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from app.api.endpoints import router as api_router

app = FastAPI(title="AI Forensic Analysis API")

# Configure CORS
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

if not allowed_origins:
    origins = ["*"]
else:
    origins = allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True if "*" not in origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create data directory if it doesn't exist
DATA_DIR = "data/uploads"
os.makedirs(DATA_DIR, exist_ok=True)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Forensic Analysis API is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
