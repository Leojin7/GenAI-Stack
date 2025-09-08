import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set the Google API key from environment variable or use default
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY", "AIzaSyBRPzlvNoVQg-R52sr_EJtA_hTpp_XzjGw")

# Import the app after setting environment variables
from main import app

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

if __name__ == "__main__":
    try:
        logger.info("Starting server with the following configuration:")
        logger.info(f"API Key: {'*' * 8 + os.environ.get('GOOGLE_API_KEY', '')[-4:] if os.environ.get('GOOGLE_API_KEY') else 'Not set'}")
        logger.info("Server will be available at http://localhost:8000")
        
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        raise
