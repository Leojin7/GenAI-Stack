import sys
import os
from fastapi.testclient import TestClient
from main import app
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create test client
client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    print("Root endpoint test passed!")

def test_chat():
    test_message = {
        "message": "Hello, world!",
        "context": "Testing context",
        "stackContext": "Test stack"
    }
    response = client.post(
        "/api/chat",
        json=test_message,
        headers={"Authorization": "Bearer test_token"}  # Add auth if needed
    )
    print(f"Chat response: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    print("Testing backend...")
    test_root()
    test_chat()
