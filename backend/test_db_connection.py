import sys
import os
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add backend directory to Python path
BACKEND_DIR = Path(__file__).parent.absolute()
sys.path.append(str(BACKEND_DIR))

# Import database configuration
from database.database import Base, engine, SessionLocal
from database.models import User
from auth.security import get_password_hash

def test_db_connection():
    print("=== Testing Database Connection ===")
    
    # Test raw connection
    try:
        with engine.connect() as conn:
            print("✅ Successfully connected to the database")
    except Exception as e:
        print(f"❌ Failed to connect to database: {str(e)}")
        return
    
    # Create tables
    try:
        print("\n=== Creating tables if they don't exist ===")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created/verified successfully")
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")
    
    # Test user creation
    db = SessionLocal()
    try:
        print("\n=== Testing user creation ===")
        test_email = "test@example.com"
        
        # Delete existing test user if exists
        existing_user = db.query(User).filter(User.email == test_email).first()
        if existing_user:
            print("Found existing test user, deleting...")
            db.delete(existing_user)
            db.commit()
        
        # Create new test user
        hashed_password = get_password_hash("testpassword")
        new_user = User(
            email=test_email,
            username="testuser",
            hashed_password=hashed_password,
            full_name="Test User",
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print("✅ Test user created successfully!")
        print(f"User ID: {new_user.id}")
        print(f"Email: {new_user.email}")
        
    except Exception as e:
        print(f"❌ Error creating test user: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create db directory if it doesn't exist
    os.makedirs("db", exist_ok=True)
    test_db_connection()
