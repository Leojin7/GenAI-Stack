import requests

def test_login():
    # Test user credentials
    test_email = "test@example.com"
    test_password = "testpassword"
    
    # Login endpoint URL
    login_url = "http://localhost:8000/api/auth/token"
    
    # Prepare form data
    form_data = {
        'username': test_email,
        'password': test_password
    }
    
    print(f"Testing login with email: {test_email}")
    
    try:
        # Make the login request
        response = requests.post(
            login_url,
            data=form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("\n🎉 Login successful!")
            token = response.json().get('access_token')
            print(f"Access token: {token}")
            
            # Test the /me endpoint with the token
            if token:
                print("\nTesting /me endpoint...")
                headers = {"Authorization": f"Bearer {token}"}
                me_response = requests.get(
                    "http://localhost:8000/api/auth/me",
                    headers=headers
                )
                print(f"Status code: {me_response.status_code}")
                print(f"Response: {me_response.text}")
        else:
            print("\n❌ Login failed")
            
    except Exception as e:
        print(f"\n❌ Error making request: {str(e)}")

if __name__ == "__main__":
    print("Make sure the FastAPI server is running on http://localhost:8000")
    test_login()
