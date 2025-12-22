"""
Serenia Backend - Main FastAPI Application
Trimodal Emotional Intelligence Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Serenia API",
    description="Trimodal Emotional Intelligence Platform - Chat, Reflections, Insights",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", '["http://localhost:3000"]')
# Parse JSON string to list
import json
try:
    origins_list = json.loads(allowed_origins)
except:
    origins_list = ["http://localhost:3000", "http://localhost:3001"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on application startup"""
    from database import init_db, test_connection
    
    print("=" * 50)
    print("Initializing Serenia Backend...")
    print("=" * 50)
    
    # Test database connection
    if test_connection():
        print("✓ Database connection successful")
        
        # Create tables if they don't exist
        try:
            init_db()
            print("✓ Database tables initialized")
        except Exception as e:
            print(f"✗ Database initialization failed: {e}")
    else:
        print("✗ Database connection failed")
    
    print("=" * 50)


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Serenia API",
        "version": "1.0.0",
        "features": ["Chat (Whiz)", "Reflections", "Insights"],
        "status": "operational"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": os.getenv("APP_ENV", "development")
    }

# API Info endpoint
@app.get("/api/info")
async def api_info():
    return {
        "name": "Serenia Trimodal Platform",
        "description": "AI-powered mental wellness platform",
        "endpoints": {
            "chat": "/api/chat",
            "reflections": "/api/reflections",
            "insights": "/api/insights"
        }
    }

# Import and register routers
from api.chat import router as chat_router
from api.journal import router as journal_router
from api.insights import router as insights_router

app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(journal_router, prefix="/api/journal", tags=["Journal"])
app.include_router(insights_router, prefix="/api/insights", tags=["Insights"])

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "path": str(request.url)}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "message": str(exc)}
    )

# Run the application
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=port,
        reload=True if os.getenv("APP_ENV") == "development" else False
    )
