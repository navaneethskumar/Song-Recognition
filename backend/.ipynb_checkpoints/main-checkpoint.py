from fastapi import FastAPI, UploadFile, File
import sqlite3
import os
from backend.fingerprint import extract_fingerprint 
from backend.database import create_database
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 👈 Allow React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
# Ensure temp folder exists
os.makedirs("temp", exist_ok=True)

# Store song in database
def insert_song(name, artist, fingerprint):
    conn = sqlite3.connect("songs.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO songs (name, artist, fingerprint) VALUES (?, ?, ?)", 
                   (name, artist, fingerprint))
    conn.commit()
    conn.close()

# Check if song exists
def match_song(query_fingerprint):
    conn = sqlite3.connect("songs.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name, artist FROM songs WHERE fingerprint=?", (query_fingerprint,))
    result = cursor.fetchone()
    conn.close()
    return result if result else None

# API Endpoint: Recognize a Song
@app.post("/recognize/")
async def recognize_song(file: UploadFile = File(...)):
    file_location = f"temp/{file.filename}"
    with open(file_location, "wb") as buffer:
        buffer.write(file.file.read())

    fingerprint = extract_fingerprint(file_location)
    result = match_song(fingerprint)
    os.remove(file_location)  # Clean up temp file

    if result:
        return {"status": "success", "song": {"name": result[0], "artist": result[1]}}
    else:
        return {"status": "not found", "message": "No matching song in the database"}

# API Endpoint: Add a New Song
@app.post("/add_song/")
async def add_song(name: str, artist: str, file: UploadFile = File(...)):
    file_location = f"temp/{file.filename}"
    with open(file_location, "wb") as buffer:
        buffer.write(file.file.read())

    fingerprint = extract_fingerprint(file_location)
    insert_song(name, artist, fingerprint)
    os.remove(file_location)  # Clean up temp file

    return {"status": "success", "message": f"Song '{name}' by '{artist}' added to database"}

