import sys
import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from auth.security import get_password_hash
from database.database import Base, engine
from database.models import User

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Create a new session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def create_test_user():
    try:
        # Test user data
        test_email = "test@example.com"
        test_password = "testpassword"
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == test_email).first()
        if existing_user:
            print(f"User {test_email} already exists. Deleting...")
            db.delete(existing_user)
            db.commit()
        
        # Create new user
        hashed_password = get_password_hash(test_password)
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
        print(f"Email: {test_email}")
        print(f"Password: {test_password}")
        
        # Verify the user was created
        created_user = db.query(User).filter(User.email == test_email).first()
        if created_user:
            print("\nUser details from database:")
            print(f"ID: {created_user.id}")
            print(f"Email: {created_user.email}")
            print(f"Username: {created_user.username}")
            print(f"Active: {created_user.is_active}")
        
    except Exception as e:
        print(f"❌ Error creating test user: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create db directory if it doesn't exist
    os.makedirs("db", exist_ok=True)
    create_test_user()
