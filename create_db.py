import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

load_dotenv()

def create_database():
    try:
    
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            print("Error: DATABASE_URL not found in .env file")
            return

        
        import re
        match = re.match(r'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', db_url)
        if not match:
            print("Error: Invalid DATABASE_URL format")
            return
            
        username, password, host, port, database = match.groups()
        
        
        conn = psycopg2.connect(
            dbname="postgres",  
            user=username,
            password=password,
            host=host,
            port=port
        )
        conn.autocommit = True
        
        
        cursor = conn.cursor()
        
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (database,))
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Database '{database}' does not exist. Creating it now...")
            
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(
                sql.Identifier(database))
            )
            print(f"Database '{database}' created successfully!")
        else:
            print(f"Database '{database}' already exists.")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    create_database()
