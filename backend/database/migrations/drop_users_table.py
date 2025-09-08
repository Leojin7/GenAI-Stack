"""
Migration to remove the users table and update chat_history
"""
from sqlalchemy import text

def upgrade(db):
    # Drop foreign key constraint first
    db.execute(text("""
        PRAGMA foreign_keys=off;
        
        BEGIN TRANSACTION;
        
        -- Create new chat_history table without user_id
        CREATE TABLE chat_history_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            user_message TEXT NOT NULL,
            ai_response TEXT NOT NULL,
            context TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Copy data from old table to new one
        INSERT INTO chat_history_new (id, user_message, ai_response, context, timestamp)
        SELECT id, user_message, ai_response, context, timestamp FROM chat_history;
        
        -- Drop old table
        DROP TABLE chat_history;
        
        -- Rename new table
        ALTER TABLE chat_history_new RENAME TO chat_history;
        
        -- Drop users table
        DROP TABLE IF EXISTS users;
        
        COMMIT;
        
        PRAGMA foreign_keys=on;
    """))
    
    print("Successfully updated database schema")

def downgrade(db):
    # Note: This is a one-way migration. To revert, you would need to recreate the users table
    # and restore data from a backup.
    print("This migration cannot be automatically reverted. Please restore from backup.")
