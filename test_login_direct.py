import requests
import sys

def test_login():
    url = "http://localhost:8000/api/auth/token"
    data = {
        "username": "test@example.com",
        "password": "password"
    }
    
    print(f"Testing login at {url}")
    try:
        response = requests.post(url, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {response.headers}")
        print(f"Response Content: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    if test_login():
        print("✅ Login test passed")
        sys.exit(0)
    else:
        print("❌ Login test failed")
        sys.exit(1)
