from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from database.database import engine
from database.models import Base, User

def check_database():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("\nTables in database:", tables)
    
    if 'users' in tables:
        print("\nUsers table exists. Checking for users...")
        Session = sessionmaker(bind=engine)
        session = Session()
        
        try:
            users = session.query(User).all()
            if users:
                print("\nUsers found in database:")
                for user in users:
                    print(f"- ID: {user.id}, Email: {user.email}, Username: {user.username}")
            else:
                print("No users found in the database.")
        except Exception as e:
            print(f"Error querying users: {e}")
        finally:
            session.close()
    else:
        print("Users table does not exist. Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("Tables created. Please run the script again to check for users.")

if __name__ == "__main__":
    check_database()
    input("\nPress Enter to exit...")
