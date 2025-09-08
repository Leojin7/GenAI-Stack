import os
import sys
from pathlib import Path


sys.path.append(str(Path(__file__).parent))

from database.database import Base, engine
import database.models  
def init_db():
    # Create all tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
