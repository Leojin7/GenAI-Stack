import sys
import os
import requests
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

def check_database():
    print("\n=== Checking Database ===")
    db_exists = os.path.exists('db/genaistack.db')
    print(f"Database exists: {db_exists}")
    
    if db_exists:
        print(f"Database size: {os.path.getsize('db/genaistack.db')} bytes")
        
        # Connect to the database
        try:
            conn = create_engine('sqlite:///db/genaistack.db').connect()
            tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
            print("\nTables in database:")
            for table in tables:
                print(f"- {table[0]}")
                
                # Show table structure
                if table[0] == 'users':
                    print("  Table structure:")
                    cols = conn.execute(f"PRAGMA table_info({table[0]});").fetchall()
                    for col in cols:
                        print(f"  - {col[1]} ({col[2]})")
                    
                    # Show users
                    users = conn.execute("SELECT id, email, username, is_active FROM users;").fetchall()
                    print("\nUsers:")
                    for user in users:
                        print(f"- ID: {user[0]}, Email: {user[1]}, Username: {user[2]}, Active: {bool(user[3])}")
            
            conn.close()
            return True
            
        except Exception as e:
            print(f"❌ Error accessing database: {e}")
            return False
    return False

def test_login():
    print("\n=== Testing Login ===")
    test_email = "test@example.com"
    test_password = "testpassword"
    
    try:
        print(f"Attempting login with email: {test_email}")
        response = requests.post(
            'http://localhost:8000/api/auth/token',
            data={'username': test_email, 'password': test_password},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            token = response.json().get('access_token')
            print("✅ Login successful!")
            return token
        else:
            print("❌ Login failed")
            return None
            
    except Exception as e:
        print(f"❌ Error testing login: {e}")
        return None

def test_me_endpoint(token):
    if not token:
        print("Skipping /me test - no token")
        return
        
    print("\n=== Testing /me Endpoint ===")
    try:
        response = requests.get(
            'http://localhost:8000/api/auth/me',
            headers={"Authorization": f"Bearer {token}"}
        )
        
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ /me endpoint test passed!")
        else:
            print("❌ /me endpoint test failed")
            
    except Exception as e:
        print(f"❌ Error testing /me endpoint: {e}")

def ensure_test_user():
    print("\n=== Ensuring Test User Exists ===")
    db = SessionLocal()
    try:
        test_email = "test@example.com"
        user = db.query(User).filter(User.email == test_email).first()
        
        if user:
            print(f"Test user already exists with ID: {user.id}")
        else:
            print("Creating test user...")
            hashed_password = get_password_hash("testpassword")
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
            print(f"✅ Created test user with ID: {user.id}")
            
    except Exception as e:
        print(f"❌ Error ensuring test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Starting Test Flow ===")
    
    # Ensure db directory exists
    os.makedirs('db', exist_ok=True)
    
    # Check database
    db_ok = check_database()
    
    if not db_ok:
        print("\n⚠️ Database not found or inaccessible. Creating a new one...")
        try:
            # Create all tables
            Base.metadata.create_all(bind=engine)
            print("✅ Created database tables")
        except Exception as e:
            print(f"❌ Failed to create database: {e}")
            sys.exit(1)
    
    # Ensure test user exists
    ensure_test_user()
    
    # Test login
    token = test_login()
    
    # Test /me endpoint if login was successful
    if token:
        test_me_endpoint(token)
    
    print("\n=== Test Flow Complete ===")
    print("\nIf you're still having issues, please check:")
    print("1. Is the FastAPI server running? (uvicorn main:app --reload --host 0.0.0.0 --port 8000)")
    print("2. Are there any error messages in the server logs?")
    print("3. Is the database file accessible and writable? (db/genaistack.db)")
