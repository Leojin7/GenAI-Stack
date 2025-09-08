import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.database import Base
from database.models import User
from auth.security import get_password_hash

def setup_database():
    # Database URL
    SQLALCHEMY_DATABASE_URL = "sqlite:///./db/genaistack.db"
    
    # Create engine and bind session
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Create a new session
    db = SessionLocal()
    
    try:
        # Create test user
        test_email = "test@example.com"
        test_password = "testpassword"
        
        # Check if user exists
        existing_user = db.query(User).filter(User.email == test_email).first()
        if existing_user:
            print(f"User {test_email} already exists. Deleting...")
            db.delete(existing_user)
            db.commit()
        
        # Create new user
        hashed_password = get_password_hash(test_password)
        user = User(
            email=test_email,
            username="testuser",
            hashed_password=hashed_password,
            full_name="Test User",
            is_active=True
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"\nTest user created successfully!")
        print(f"Email: {test_email}")
        print(f"Password: {test_password}")
        print("\nYou can now try to log in with these credentials.")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create db directory if it doesn't exist
    os.makedirs("db", exist_ok=True)
    setup_database()
