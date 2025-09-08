import sys
import os
from pathlib import Path

print("=== Python Environment ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")
print(f"Executable: {sys.executable}")

print("\n=== Environment Variables ===")
for key, value in os.environ.items():
    if 'PASS' not in key and 'TOKEN' not in key and 'KEY' not in key:
        print(f"{key}: {value}")

print("\n=== Directory Structure ===")
def list_files(path, level=0):
    prefix = ' ' * 4 * level
    try:
        for entry in os.scandir(path):
            if entry.is_dir():
                print(f"{prefix}📁 {entry.name}")
                list_files(entry.path, level + 1)
            else:
                print(f"{prefix}📄 {entry.name}")
    except Exception as e:
        print(f"{prefix}❌ Error accessing {path}: {e}")

list_files('.')

print("\n=== Testing Database Connection ===")
try:
    from database.database import engine
    print("✅ Database engine created successfully")
    
    # Test database connection
    with engine.connect() as conn:
        print("✅ Successfully connected to the database")
        
    # Check if tables exist
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\nDatabase tables: {tables}")
    
except Exception as e:
    print(f"❌ Database error: {e}")
    import traceback
    traceback.print_exc()

print("\n=== Testing Complete ===")
