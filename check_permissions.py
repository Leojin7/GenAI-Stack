import os
import sys
from pathlib import Path

def check_permissions():
    print("=== System Information ===")
    print(f"Python version: {sys.version}")
    print(f"Current working directory: {os.getcwd()}")
    
    # Check if we can create a directory
    test_dir = Path("test_dir")
    try:
        test_dir.mkdir(exist_ok=True)
        print("✅ Successfully created test directory")
        
        # Try to create a file
        test_file = test_dir / "test.txt"
        try:
            with open(test_file, 'w') as f:
                f.write("This is a test file.\n")
            print(f"✅ Successfully wrote to {test_file}")
            
            # Read the file back
            try:
                with open(test_file, 'r') as f:
                    content = f.read()
                print(f"✅ Successfully read from {test_file}")
                print(f"File content: {content!r}")
            except Exception as e:
                print(f"❌ Error reading file: {e}")
                
        except Exception as e:
            print(f"❌ Error writing to file: {e}")
            
    except Exception as e:
        print(f"❌ Error creating directory: {e}")
    finally:
        # Clean up
        if test_file.exists():
            test_file.unlink()
        if test_dir.exists():
            test_dir.rmdir()
    
    # Check database directory
    db_dir = Path("backend/db")
    print(f"\n=== Checking database directory: {db_dir} ===")
    print(f"Exists: {db_dir.exists()}")
    if db_dir.exists():
        print(f"Is directory: {db_dir.is_dir()}")
        print(f"Is writable: {os.access(db_dir, os.W_OK)}")
        print("Contents:", list(db_dir.iterdir()))
    
    # Check if we can create a file in the db directory
    try:
        db_dir.mkdir(parents=True, exist_ok=True)
        test_db_file = db_dir / "test_db_file"
        test_db_file.touch()
        print(f"✅ Successfully created test file in db directory: {test_db_file}")
        test_db_file.unlink()
    except Exception as e:
        print(f"❌ Error creating test file in db directory: {e}")

if __name__ == "__main__":
    check_permissions()
    input("\nPress Enter to exit...")
