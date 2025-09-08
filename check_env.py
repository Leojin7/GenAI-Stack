import sys
import os
import subprocess

def check_python():
    print("=== Python Environment Check ===")
    print(f"Python Executable: {sys.executable}")
    print(f"Python Version: {sys.version}")
    print(f"Working Directory: {os.getcwd()}")
    print("\n=== Checking Dependencies ===")
    
    # List of required packages
    required_packages = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'python-jose',
        'passlib[bcrypt]',
        'python-multipart',
        'python-dotenv'
    ]
    
    for package in required_packages:
        try:
            __import__(package.split('[')[0] if '[' in package else package)
            print(f"✓ {package} is installed")
        except ImportError:
            print(f"✗ {package} is NOT installed")
    
    print("\n=== Environment Variables ===")
    print(f"DATABASE_URL: {os.getenv('DATABASE_URL', 'Not set')}")
    print(f"SECRET_KEY: {'Set' if os.getenv('SECRET_KEY') else 'Not set'}")
    print(f"ALGORITHM: {os.getenv('ALGORITHM', 'Not set')}")

if __name__ == "__main__":
    check_python()
