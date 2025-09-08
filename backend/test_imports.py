# test_imports.py
print("Testing Python imports...")
try:
    import fastapi
    import uvicorn
    import sqlalchemy
    from dotenv import load_dotenv
    print("All required packages are installed!")
    print(f"FastAPI version: {fastapi.__version__}")
    print(f"SQLAlchemy version: {sqlalchemy.__version__}")
except ImportError as e:
    print(f"Error importing required packages: {e}")