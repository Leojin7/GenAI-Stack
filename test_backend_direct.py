import requests
import json

# Test the backend API directly
BASE_URL = "http://localhost:8000/api"

def test_root():
    response = requests.get(f"{BASE_URL}/")
    print(f"Root response: {response.status_code}")
    print(response.text)

def test_chat():
    url = f"{BASE_URL}/chat"
    payload = {
        "message": "Hello, what's your name?",
        "context": "Test context",
        "stackContext": "Test stack"
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"\nChat response status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")

if __name__ == "__main__":
    print("Testing backend API...")
    test_root()
    test_chat()
