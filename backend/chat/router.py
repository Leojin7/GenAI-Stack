from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import logging
import uuid
from datetime import datetime

# Database
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import ChatHistory

# Initialize router
router = APIRouter(prefix="/chat", tags=["Chat"])
logger = logging.getLogger(__name__)

# Simple in-memory session store (replace with a proper session store in production)
sessions = {}

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    context: Optional[Dict[str, Any]] = None

def get_or_create_session(session_id: str = None) -> str:
    """Get existing session or create a new one"""
    if not session_id or session_id not in sessions:
        session_id = str(uuid.uuid4())
        sessions[session_id] = {
            "created_at": datetime.utcnow(),
            "last_activity": datetime.utcnow()
        }
    return session_id

def generate_response(message: str) -> str:
    """Generate a response to the user's message"""
    # This is a simple echo response - replace with your actual AI model integration
    return f"You said: {message}"

def save_chat_history(session_id: str, user_message: str, ai_response: str, db: Session):
    """Save chat history to the database"""
    try:
        chat = ChatHistory(
            session_id=session_id,
            user_message=user_message,
            ai_response=ai_response,
            timestamp=datetime.utcnow()
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)
        return chat
    except Exception as e:
        db.rollback()
        logger.error(f"Error saving chat history: {str(e)}")
        return None

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(
    chat_request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Chat with the AI assistant.
    
    This endpoint processes user messages and returns AI-generated responses.
    """
    try:
        # Get or create session
        session_id = get_or_create_session(chat_request.session_id)
        sessions[session_id]["last_activity"] = datetime.utcnow()
        
        # Generate response
        response_text = generate_response(chat_request.message)
        
        # Save to chat history
        save_chat_history(
            session_id=session_id,
            user_message=chat_request.message,
            ai_response=response_text,
            db=db
        )
        
        return {
            "response": response_text,
            "session_id": session_id,
            "context": chat_request.context or {}
        }
        
    except HTTPException as http_exc:
        # Re-raise HTTP exceptions (like rate limiting)
        raise http_exc
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return {
            "response": "Sorry, an error occurred while processing your request.",
            "session_id": chat_request.session_id or str(uuid.uuid4()),
            "context": {"error": str(e)[:200], "fallback": True}
        }

# Export the router
__all__ = ["router"]
