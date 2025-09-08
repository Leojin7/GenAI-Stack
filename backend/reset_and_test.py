import os
import sys
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to Python path
BACKEND_DIR = Path(__file__).parent.absolute()
sys.path.append(str(BACKEND_DIR))

# Import database and models
from database.database import Base, engine, SessionLocal
from database.models import User
from auth.security import get_password_hash

def reset_database():
    """Remove existing database and create a fresh one"""
    db_path = BACKEND_DIR / 'db' / 'genaistack.db'
    
    # Remove existing database if it exists
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print(f"✅ Removed existing database: {db_path}")
        except Exception as e:
            print(f"❌ Error removing database: {e}")
            return False
    
    # Create db directory if it doesn't exist
    os.makedirs(BACKEND_DIR / 'db', exist_ok=True)
    
    # Create all tables
    try:
        print("\n=== Creating database tables ===")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created")
        return True
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        return False

def create_test_user():
    """Create a test user in the database"""
    db = SessionLocal()
    try:
        test_email = "test@example.com"
        test_password = "testpassword"
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == test_email).first()
        if existing_user:
            print(f"Removing existing test user with email: {test_email}")
            db.delete(existing_user)
            db.commit()
        
        # Create new test user
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
        
        print("\n✅ Test user created successfully!")
        print(f"Email: {test_email}")
        print(f"Password: {test_password}")
        return True
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def test_login():
    """Test the login endpoint with the test user"""
    import requests
    
    print("\n=== Testing Login Endpoint ===")
    test_email = "test@example.com"
    test_password = "testpassword"
    
    try:
        print(f"Sending login request with email: {test_email}")
        response = requests.post(
            'http://localhost:8000/api/auth/token',
            data={
                'username': test_email,
                'password': test_password
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("\n✅ Login successful!")
            token = response.json().get('access_token')
            print(f"Access token: {token}")
            return token
        else:
            print("\n❌ Login failed")
            return None
            
    except Exception as e:
        print(f"\n❌ Error testing login: {e}")
        return None

if __name__ == "__main__":
    print("=== Resetting Database and Testing Login ===")
    
    # Reset the database
    if not reset_database():
        print("\n❌ Failed to reset database. Exiting...")
        sys.exit(1)
    
    # Create test user
    if not create_test_user():
        print("\n❌ Failed to create test user. Exiting...")
        sys.exit(1)
    
    # Test login
    token = test_login()
    
    if token:
        print("\n✅ Setup and test completed successfully!")
        print("\nYou can now log in with:")
        print("Email: test@example.com")
        print("Password: testpassword")
        print("\nStart the FastAPI server with:")
        print("uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    else:
        print("\n❌ Login test failed. Please check the server logs for errors.")
        sys.exit(1)
