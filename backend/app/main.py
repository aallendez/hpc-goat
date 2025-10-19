from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import questions, mocktest

app = FastAPI(
    title="HPC Saviour API",
    description="API for HPC mock test application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(questions.router, prefix="/questions", tags=["questions"])
app.include_router(mocktest.router, prefix="/mocktest", tags=["mocktest"])

@app.get("/")
async def root():
    return {"message": "HPC Saviour API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
