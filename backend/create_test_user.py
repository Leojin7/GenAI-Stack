import sys
import os
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from database.database import get_db
from database.models import User, Base
from auth.security import get_password_hash

def create_test_user():
    # Create database engine
    SQLALCHEMY_DATABASE_URL = "sqlite:///./db/genaistack.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create a new session
    db = Session(autocommit=False, autoflush=False, bind=engine)
    
    try:
        # Check if test user already exists
        test_email = "test@example.com"
        existing_user = db.query(User).filter(User.email == test_email).first()
        
        if existing_user:
            print(f"Test user already exists with ID: {existing_user.id}")
            db.delete(existing_user)
            db.commit()
            print("Deleted existing test user")
        
        # Create new test user
        hashed_password = get_password_hash("testpassword")
        test_user = User(
            email=test_email,
            username="testuser",
            hashed_password=hashed_password,
            full_name="Test User",
            is_active=True
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print(f"Created test user with ID: {test_user.id}")
        print(f"Email: {test_user.email}")
        print(f"Username: {test_user.username}")
        
        # Verify the user was created
        created_user = db.query(User).filter(User.email == test_email).first()
        if created_user:
            print("\nUser successfully created in database!")
            print(f"User ID: {created_user.id}")
            print(f"Email: {created_user.email}")
            print(f"Active: {created_user.is_active}")
        
    except Exception as e:
        db.rollback()
        print(f"Error: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating test user...")
    create_test_user()
