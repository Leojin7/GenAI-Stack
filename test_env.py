import sys
import os
import subprocess

def main():
    print("=== Python Environment Test ===")
    print(f"Python executable: {sys.executable}")
    print(f"Python version: {sys.version}")
    print(f"Working directory: {os.getcwd()}")
    
    # Test running a simple command
    print("\nTesting basic command execution...")
    try:
        result = subprocess.run(["python", "--version"], capture_output=True, text=True)
        print(f"Command output: {result.stdout.strip() if result.stdout else result.stderr.strip()}")
    except Exception as e:
        print(f"Error running command: {e}")
    
    # Test importing required modules
    print("\nTesting module imports...")
    modules = ["fastapi", "uvicorn", "sqlalchemy", "passlib"]
    for module in modules:
        try:
            __import__(module)
            print(f"✅ {module} is available")
        except ImportError as e:
            print(f"❌ {module} is NOT available: {e}")
    
    # Test database directory
    db_dir = os.path.join("backend", "db")
    print(f"\nChecking database directory: {os.path.abspath(db_dir)}")
    if not os.path.exists(db_dir):
        try:
            os.makedirs(db_dir)
            print("✅ Created database directory")
        except Exception as e:
            print(f"❌ Failed to create database directory: {e}")
    else:
        print("✅ Database directory exists")
    
    # Test running the FastAPI app
    print("\nTesting FastAPI application...")
    try:
        from fastapi import FastAPI
        app = FastAPI()
        
        @app.get("/")
        def read_root():
            return {"message": "Test successful!"}
            
        print("✅ FastAPI application created successfully")
        print("\nTo start the server, run:")
        print(f"{sys.executable} -m uvicorn test_env:app --reload")
    except Exception as e:
        print(f"❌ Error creating FastAPI app: {e}")

if __name__ == "__main__":
    main()
