import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.database import Base, engine, get_db
from database.models import User

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def list_users():
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        users = session.query(User).all()
        if not users:
            print("No users found in the database.")
        else:
            print("\nUsers in database:")
            for user in users:
                print(f"- ID: {user.id}, Email: {user.email}, Username: {user.username}")
    except Exception as e:
        print(f"Error accessing database: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    print("=== Database Test Utility ===")
    print("1. Initialize database")
    print("2. List all users")
    
    choice = input("\nChoose an option (1 or 2): ")
    
    if choice == "1":
        init_db()
    elif choice == "2":
        list_users()
    else:
        print("Invalid choice.")
    
    input("\nPress Enter to exit...")
