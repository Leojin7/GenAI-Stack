import os
import sys

print("Python version:", sys.version)
print("Current working directory:", os.getcwd())
print("Environment variables:")
for key in ['DATABASE_URL', 'SECRET_KEY', 'ALGORITHM']:
    print(f"{key}: {'*' * 20 if os.getenv(key) else 'Not set'}")

print("\nAttempting to load .env file...")
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Environment variables after loading .env:")
    for key in ['DATABASE_URL', 'SECRET_KEY', 'ALGORITHM']:
        print(f"{key}: {'*' * 20 if os.getenv(key) else 'Not set'}")
except Exception as e:
    print(f"Error loading .env: {e}")
