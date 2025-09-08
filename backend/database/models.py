from sqlalchemy import Column, Integer, String, DateTime, func, Text
from sqlalchemy.ext.declarative import declarative_base
from .database import engine

Base = declarative_base()

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)  # Client-side session ID
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    context = Column(Text, nullable=True)  # Store additional context as JSON
    timestamp = Column(DateTime, server_default=func.now())
    
    def __repr__(self):
        return f"<ChatHistory {self.id} - Session {self.session_id}>"