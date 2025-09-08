import sys
from database.database import SessionLocal
from database.models import User
from auth.security import get_password_hash

def create_test_user():
    db = SessionLocal()
    try:
        # Check if test user already exists
        test_email = "test@example.com"
        existing_user = db.query(User).filter(User.email == test_email).first()
        
        if existing_user:
            print(f"Test user already exists with email: {test_email}")
            return
            
        # Create test user
        hashed_password = get_password_hash("testpass")
        test_user = User(
            email=test_email,
            username="testuser",
            full_name="Test User",
            hashed_password=hashed_password,
            is_active=True
        )
        db.add(test_user)
        db.commit()
        print(f"Created test user with email: {test_email} and password: testpass")
        
    except Exception as e:
        print(f"Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
