import os
import sys
from pathlib import Path

def check_db_path():
  
    cwd = Path.cwd()
    print(f"Current working directory: {cwd}")
    
    
    db_dir = cwd / 'db'
    db_path = db_dir / 'genaistack.db'
    
    print(f"\nChecking database directory: {db_dir}")
    print(f"Database file path: {db_path}")
    
  
    print(f"\nDirectory exists: {db_dir.exists()}")
    if db_dir.exists():
        print(f"Directory is writable: {os.access(db_dir, os.W_OK)}")
        
       
        print("\nDirectory contents:")
        try:
            for item in db_dir.iterdir():
                print(f"- {item.name} (file: {item.is_file()}, size: {item.stat().st_size if item.is_file() else 'N/A'} bytes)")
        except Exception as e:
            print(f"Error listing directory: {e}")
    
  
    print(f"\nDatabase file exists: {db_path.exists()}")
    if db_path.exists():
        print(f"Database size: {db_path.stat().st_size} bytes")
        print(f"File is writable: {os.access(db_path, os.W_OK)}")
    
    print(f"\nParent directory permissions:")
    parent = db_dir.parent
    print(f"{parent} exists: {parent.exists()}")
    print(f"{parent} is writable: {os.access(parent, os.W_OK)}")

if __name__ == "__main__":
    check_db_path()
    input("\nPress Enter to exit...")
