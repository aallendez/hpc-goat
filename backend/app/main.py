from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import questions, mocktest

app = FastAPI(
    title="HPC Goat API",
    description="API for HPC mock test application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server and Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(questions.router, prefix="/api/questions", tags=["questions"])
app.include_router(mocktest.router, prefix="/api/mocktest", tags=["mocktest"])

@app.get("/")
async def root():
    return {"message": "HPC Goat API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
