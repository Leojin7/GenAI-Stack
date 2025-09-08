
from sqlalchemy import text
from database.database import engine

def upgrade():
    with engine.connect() as conn:
        conn.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS full_name VARCHAR
        """))
        conn.commit()

if __name__ == "__main__":
    upgrade()