import sqlite3

def create_database():
    conn = sqlite3.connect("songs.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            artist TEXT,
            fingerprint TEXT
        )
    """)
    conn.commit()
    conn.close()

create_database()  # Run once to initialize the database
