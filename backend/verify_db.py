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

print("=== Database Verification ===")
print(f"Database file: {os.path.abspath('db/genaistack.db')}")

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def check_database():
    db = SessionLocal()
    try:
        # Check if users table exists
        result = db.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='users';"))
        users_table_exists = result.fetchone() is not None
        
        print(f"Users table exists: {users_table_exists}")
        
        if users_table_exists:
            # Check if test user exists
            test_email = "test@example.com"
            user = db.query(User).filter(User.email == test_email).first()
            
            if user:
                print("\nTest user found:")
                print(f"ID: {user.id}")
                print(f"Email: {user.email}")
                print(f"Username: {user.username}")
                print(f"Active: {user.is_active}")
            else:
                print("\nTest user not found. Creating test user...")
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
                
    except Exception as e:
        print(f"\n❌ Error checking database: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create db directory if it doesn't exist
    os.makedirs("db", exist_ok=True)
    check_database()
