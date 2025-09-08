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
    # Delete existing database file if it exists
    db_path = BACKEND_DIR / 'db' / 'genaistack.db'
    if db_path.exists():
        try:
            os.remove(db_path)
            print(f"✅ Deleted existing database: {db_path}")
        except Exception as e:
            print(f"❌ Error deleting database: {str(e)}")
            return
    
    # Create db directory if it doesn't exist
    os.makedirs(BACKEND_DIR / 'db', exist_ok=True)
    
    # Create all tables
    try:
        print("\n=== Creating database tables ===")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")
        return
    
    # Create test user
    db = SessionLocal()
    try:
        print("\n=== Creating test user ===")
        test_email = "test@example.com"
        
        # Create test user
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
        
        print("✅ Test user created successfully!")
        print(f"User ID: {user.id}")
        print(f"Email: {user.email}")
        print(f"Username: {user.username}")
        print("\nYou can now log in with:")
        print(f"Email: {test_email}")
        print("Password: testpassword")
        
    except Exception as e:
        print(f"❌ Error creating test user: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Resetting Database ===")
    reset_database()
