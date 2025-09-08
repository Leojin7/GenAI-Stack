import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_endpoint(endpoint, method="GET", data=None, headers=None):
    url = f"{BASE_URL}{endpoint}"
    print(f"\nTesting {method} {url}")
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        else:
            print(f"Unsupported method: {method}")
            return None
            
        print(f"Status Code: {response.status_code}")
        try:
            print("Response:", json.dumps(response.json(), indent=2))
        except:
            print("Response:", response.text)
            
        return response
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

def main():
    print("=== Testing API Endpoints ===\n")
    
    # Test database connection
    test_endpoint("/test-db")
    
    # Test signup
    test_endpoint(
        "/auth/signup",
        method="POST",
        data={
            "email": "test@example.com",
            "username": "testuser",
            "password": "testpassword123",
            "full_name": "Test User"
        }
    )
    
    # Test login
    login_response = test_endpoint(
        "/auth/login",
        method="POST",
        data={
            "username": "test@example.com",
            "password": "testpassword123"
        }
    )
    
    # If login was successful, test protected endpoints
    if login_response and login_response.status_code == 200:
        token = login_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test getting current user
        test_endpoint("/auth/me", headers=headers)
    
    print("\n=== API Testing Complete ===")

if __name__ == "__main__":
    main()
