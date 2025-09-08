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

def setup_fresh_database():
    # Ensure db directory exists
    db_dir = BACKEND_DIR / 'db'
    db_path = db_dir / 'genaistack.db'
    
    # Remove existing database if it exists
    if db_path.exists():
        try:
            os.remove(db_path)
            print("✅ Removed existing database")
        except Exception as e:
            print(f"❌ Error removing database: {e}")
            return False
    
    # Create db directory if it doesn't exist
    os.makedirs(db_dir, exist_ok=True)
    
    try:
        # Create all tables
        print("\n=== Creating database tables ===")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created")
        
        # Create a test user
        db = SessionLocal()
        try:
            print("\n=== Creating test user ===")
            test_email = "test@example.com"
            test_password = "testpassword"
            
            # Create user
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
            
            print("✅ Test user created successfully!")
            print(f"Email: {test_email}")
            print(f"Password: {test_password}")
            
            # Verify user was created
            created_user = db.query(User).filter(User.email == test_email).first()
            if created_user:
                print("\n✅ User verified in database:")
                print(f"ID: {created_user.id}")
                print(f"Email: {created_user.email}")
                print(f"Active: {created_user.is_active}")
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
            
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        return False

def start_server():
    print("\n=== Starting FastAPI server ===")
    os.system("uvicorn main:app --reload --host 0.0.0.0 --port 8000 --log-level debug")

if __name__ == "__main__":
    print("=== Setting up fresh database and test user ===")
    if setup_fresh_database():
        start_server()
