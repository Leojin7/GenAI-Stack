import requests
import sys
from pathlib import Path

# Add backend directory to Python path
BACKEND_DIR = Path(__file__).parent.absolute()
sys.path.append(str(BACKEND_DIR))

# Import database and models to ensure tables are created
from database.database import Base, engine
from database import models

# Create tables
Base.metadata.create_all(bind=engine)

def test_login():
    # Test user credentials
    test_email = "test@example.com"
    test_password = "testpassword"
    
    # Test login
    print(f"Testing login with email: {test_email}")
    
    # Prepare form data
    form_data = {
        'username': test_email,
        'password': test_password
    }
    
    # Make the request
    try:
        response = requests.post(
            "http://localhost:8000/api/auth/token",
            data=form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("\n🎉 Login successful!")
            print(f"Access token: {response.json().get('access_token')}")
        else:
            print("\n❌ Login failed")
            
    except Exception as e:
        print(f"\n❌ Error making request: {str(e)}")

if __name__ == "__main__":
    # Make sure the server is running before testing
    print("Make sure the FastAPI server is running on http://localhost:8000")
    test_login()
