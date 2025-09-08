from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL from environment or default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./genaistack.db")

# Create engine and session
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def upgrade():
    print("Running database migration: Add chat_history table")
    
    # Create a session
    db = SessionLocal()
    
    try:
        # Create the chat_history table
        metadata = MetaData()
        metadata.reflect(bind=engine)
        
        # Only create the table if it doesn't exist
        if 'chat_history' not in metadata.tables:
            chat_history = Table(
                'chat_history',
                metadata,
                Column('id', Integer, primary_key=True, index=True),
                Column('user_id', Integer, ForeignKey('users.id'), nullable=False),
                Column('user_message', Text, nullable=False),
                Column('ai_response', Text, nullable=False),
                Column('context', Text, nullable=True),
                Column('timestamp', DateTime, server_default='CURRENT_TIMESTAMP'),
            )
            
            # Create the table
            chat_history.create(engine)
            print("✅ Created chat_history table")
            
            # Add foreign key constraint if it doesn't exist
            # (SQLite handles this differently, so we need to be careful)
            if not DATABASE_URL.startswith('sqlite'):
                with engine.connect() as conn:
                    conn.execute("""
                    ALTER TABLE chat_history 
                    ADD CONSTRAINT fk_user
                    FOREIGN KEY(user_id) 
                    REFERENCES users(id)
                    """)
                    print("✅ Added foreign key constraint")
        else:
            print("ℹ️ chat_history table already exists")
            
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    upgrade()
