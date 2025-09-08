import requests
import sys

def test_backend():
    url = "http://localhost:8000/api/test-db"
    print(f"Testing backend at {url}")
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to backend: {e}")
        print("Please make sure the backend server is running")
        print("You can start it with: python -m uvicorn backend.main:app --reload")

if __name__ == "__main__":
    test_backend()
