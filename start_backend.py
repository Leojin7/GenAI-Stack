import sys
import os
import subprocess
from pathlib import Path

def check_python():
    print("=== Python Environment Check ===")
    print(f"Python executable: {sys.executable}")
    print(f"Python version: {sys.version}")
    print(f"Working directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")

def create_virtual_env():
    print("\n=== Creating Virtual Environment ===")
    venv_path = Path(".venv")
    if not venv_path.exists():
        print("Creating new virtual environment...")
        try:
            subprocess.run([sys.executable, "-m", "venv", str(venv_path)], check=True)
            print("Virtual environment created successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"Error creating virtual environment: {e}")
            return False
    else:
        print("Virtual environment already exists")
        return True

def install_dependencies():
    print("\n=== Installing Dependencies ===")
    requirements = [
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "python-multipart",
        "python-dotenv"
    ]
    
    pip_path = Path(".venv/Scripts/pip.exe") if os.name == 'nt' else Path(".venv/bin/pip")
    if not pip_path.exists():
        print(f"Error: pip not found at {pip_path}")
        return False
    
    try:
        print(f"Using pip at: {pip_path}")
        subprocess.run([str(pip_path), "install"] + requirements, check=True)
        print("Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies: {e}")
        return False

def start_server():
    print("\n=== Starting Backend Server ===")
    uvicorn_path = Path(".venv/Scripts/uvicorn.exe") if os.name == 'nt' else Path(".venv/bin/uvicorn")
    if not uvicorn_path.exists():
        print(f"Error: uvicorn not found at {uvicorn_path}")
        return False
    
    try:
        print(f"Starting server with uvicorn at: {uvicorn_path}")
        os.environ["PYTHONPATH"] = os.getcwd()
        subprocess.Popen([
            str(uvicorn_path),
            "backend.main:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload"
        ], env=os.environ)
        print("Server started successfully")
        print("\nAccess the API at: http://localhost:8000")
        print("API Documentation: http://localhost:8000/docs")
        return True
    except Exception as e:
        print(f"Error starting server: {e}")
        return False

if __name__ == "__main__":
    check_python()
    if create_virtual_env() and install_dependencies():
        start_server()
    else:
        print("\nFailed to set up the environment. Please check the error messages above.")
        sys.exit(1)
