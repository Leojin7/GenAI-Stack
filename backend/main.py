import os
import sys
import datetime
import logging
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Log Python version and paths
logger.info(f"Python version: {sys.version}")
logger.info(f"Current working directory: {os.getcwd()}")
logger.info(f"Python path: {sys.path}")

# Initialize FastAPI app with detailed metadata
app = FastAPI(
    title="GenAI Stack API",
    description="API for the GenAI Stack application",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Log startup configuration
logger.info("FastAPI application initialized")

from database.database import engine, get_db
import database.models as models
from chat.router import router as chat_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="GenAI Stack API",
    description="API for the GenAI Stack application",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

@app.get("/test-db")
async def test_db(db: Session = Depends(get_db)):
    """Test database connection and user creation"""
    try:
    
        test_user = models.User(
          email="test@example.com",
            username="testuser",
            hashed_password="hashed_password",
            full_name="Test User"
        )
        db.add(test_user)
        db.commit()
        
      
        user = db.query(models.User).filter(models.User.email == "test@example.com").first()
        
        if user:
            db.delete(user)
            db.commit()
            
        return {
            "status": "success",
            "message": "Database connection successful",
            "test_user_created_and_removed": True if user else False
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "test_user_created_and_removed": False
        }

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Add global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

# Include routers with /api prefix
# Authentication disabled
app.include_router(chat_router, prefix="/api")

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to GenAI Stack API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "version": "0.1.0",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/debug/routes")
async def debug_routes():
    routes = []
    for route in app.routes:
        routes.append({
            "path": route.path,
            "name": getattr(route, "name", ""),
            "methods": list(route.methods) if hasattr(route, "methods") else []
        })
    return {"message": "Available routes", "routes": routes}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)