import sys
import os
from pathlib import Path
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

print("=== Database Connection Test ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")

# Database configuration
DB_DIR = Path(__file__).parent.absolute() / "backend" / "db"
DB_FILE = DB_DIR / 'genaistack.db'
DATABASE_URL = f"sqlite:///{DB_FILE}"

print("\n=== Database Configuration ===")
print(f"Database directory: {DB_DIR}")
print(f"Database file: {DB_FILE}")
print(f"Database URL: {DATABASE_URL}")
print(f"Directory exists: {os.path.exists(DB_DIR)}")
print(f"Directory is writable: {os.access(DB_DIR, os.W_OK) if os.path.exists(DB_DIR) else 'N/A'}")
print(f"Database file exists: {os.path.exists(DB_FILE)}")

try:
    # Create SQLAlchemy engine
    print("\nCreating database engine...")
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=True
    )
    
    # Test connection
    print("\nTesting database connection...")
    with engine.connect() as conn:
        print("✅ Successfully connected to the database")
    
    # Check if tables exist
    print("\nChecking for tables...")
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Found tables: {tables}")
    
    # Test creating a session
    print("\nTesting session creation...")
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        print("✅ Successfully created a database session")
    finally:
        db.close()
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n=== Test Complete ===")
