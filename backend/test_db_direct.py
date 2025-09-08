import sys
import os
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add backend directory to Python path
BACKEND_DIR = Path(__file__).parent.absolute()
sys.path.append(str(BACKEND_DIR))

# Import models to ensure tables are created
from database.database import Base, engine, SessionLocal
from database.models import User
from auth.security import get_password_hash

def test_database_connection():
    print("=== Testing Database Connection ===")
    
    # Test raw connection
    try:
        with engine.connect() as conn:
            print("✅ Successfully connected to the database")
            return True
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        return False

def test_table_creation():
    print("\n=== Testing Table Creation ===")
    try:
        # Drop all tables first
        Base.metadata.drop_all(bind=engine)
        print("Dropped all tables")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Successfully created tables")
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False

def test_user_creation():
    print("\n=== Testing User Creation ===")
    db = SessionLocal()
    try:
        # Create a test user
        test_email = "test@example.com"
        test_password = "testpassword"
        
        # Delete existing user if any
        existing_user = db.query(User).filter(User.email == test_email).first()
        if existing_user:
            print(f"Found existing user: {existing_user}")
            db.delete(existing_user)
            db.commit()
            print("Deleted existing user")
        
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
        print(f"✅ Successfully created user: {user}")
        
        # Verify user was created
        created_user = db.query(User).filter(User.email == test_email).first()
        if created_user:
            print(f"✅ Verified user in database: {created_user}")
            return True
        else:
            print("❌ Failed to verify user creation")
            return False
            
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Starting Database Tests ===")
    
    # Ensure db directory exists
    os.makedirs('db', exist_ok=True)
    
    # Run tests
    connection_ok = test_database_connection()
    tables_ok = test_table_creation() if connection_ok else False
    user_ok = test_user_creation() if tables_ok else False
    
    print("\n=== Test Results ===")
    print(f"Database connection: {'✅' if connection_ok else '❌'}")
    print(f"Table creation: {'✅' if tables_ok else '❌'}")
    print(f"User creation: {'✅' if user_ok else '❌'}")
    
    if all([connection_ok, tables_ok, user_ok]):
        print("\n✅ All tests passed!")
        print("\nYou can now start the FastAPI server with:")
        print("uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    else:
        print("\n❌ Some tests failed. Please check the error messages above.")
        sys.exit(1)
