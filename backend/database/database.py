import os
import sys
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get the absolute path to the backend directory
BACKEND_DIR = Path(__file__).parent.parent.absolute()

# Database configuration
DB_DIR = BACKEND_DIR / 'db'
os.makedirs(DB_DIR, exist_ok=True)  # Ensure the directory exists

DB_FILE = DB_DIR / 'genaistack.db'
DATABASE_URL = f"sqlite:///{DB_FILE}"

# Print database configuration for debugging
print("=== Database Configuration ===")
print(f"Backend directory: {BACKEND_DIR}")
print(f"Database directory: {DB_DIR}")
print(f"Database file: {DB_FILE}")
print(f"Database URL: {DATABASE_URL}")
print(f"Directory exists: {os.path.exists(DB_DIR)}")
print(f"Directory is writable: {os.access(DB_DIR, os.W_OK) if os.path.exists(DB_DIR) else 'N/A'}")
print(f"Database file exists: {os.path.exists(DB_FILE)}")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True  # Enable SQL query logging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()