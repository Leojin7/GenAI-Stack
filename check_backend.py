import sys
import subprocess

def check_python():
    print("Python version:", sys.version)
    print("Python executable:", sys.executable)

def check_imports():
    packages = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'python-jose',
        'passlib',
        'python-multipart',
        'pydantic',
        'python-dotenv',
        'psycopg2-binary'
    ]
    
    print("\nChecking required packages:")
    for package in packages:
        try:
            __import__(package)
            print(f"✓ {package} is installed")
        except ImportError:
            print(f"✗ {package} is NOT installed")

if __name__ == "__main__":
    print("=== Backend Environment Check ===\n")
    check_python()
    check_imports()
