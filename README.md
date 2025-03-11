# Song-Recognition
The Song Recognition System is a web-based application that allows users to identify songs from short audio clips. The system follows a Shazam-like fingerprinting technique to recognize songs based on frequency peak analysis. It consists of a FastAPI backend for processing audio files and a React frontend for user interaction.
Currently working on the fingerprinting techniques on the backend. In the demo, I used the SHA256 hashing technique.
This repo is presently in development and what you would be able to see is a sample demo of the system.

Running the Project
Open two terminal windows.
In the first terminal, start the backend:
 cd backend
uvicorn main:app --reload


In the second terminal, start the frontend:
 cd frontend
npm start


Open http://localhost:3000 in your browser.
Test song recognition by uploading an audio clip.

Testing the System
Test API Manually (Using cURL)
curl -X 'POST' 'http://127.0.0.1:8000/recognize/' -F 'file=@/path/to/3-second-audio.mp3'

Expected Output:
{
  "status": "success",
  "song": {
    "name": "Adiye",
    "artist": "ARR"
  }
}

<img width="1512" alt="Screenshot 2025-03-10 at 6 31 33 PM" src="https://github.com/user-attachments/assets/54055d98-9ae2-4f6c-b78e-345c7e4e24ac" />
