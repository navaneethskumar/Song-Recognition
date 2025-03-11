import React, { useState } from 'react';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";  // Ensure it matches the backend URL

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [message, setMessage] = useState("");

  const handleRecognize = async () => {
    if (!file) {
      alert("Please select a file before recognizing!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/recognize/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ API Response:", response); // Log entire API response

      if (response.status === 200) {
        console.log("✅ API Data:", response.data); // Log API response data
        if (response.data.status === "success") {
          setResult(`🎵 Found: ${response.data.song.name} by ${response.data.song.artist}`);
        } else {
          setResult("❌ No match found.");
        }
      } else {
        setResult(`❌ Unexpected API response: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error recognizing song:", error);
      console.log("⚠️ Full Error Details:", error.response); // Log full Axios error

      if (error.response) {
        setResult(`❌ API Error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        setResult("❌ No response from the server. Check if FastAPI is running.");
      } else {
        setResult(`❌ Request error: ${error.message}`);
      }
    }
  };


  // 🎶 Add a song (Ensure there's no duplicate function)
  const handleAddSong = async () => {
    if (!file || !songName || !artistName) {
      alert("Please fill all fields and upload a file before adding a song!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_URL}/add_song/?name=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artistName)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("API Response:", response.data);  // Debugging response
      setMessage(response.data.message);
      alert("Song added successfully!");
    } catch (error) {
      console.error("Error adding song:", error);
      setMessage("❌ Error adding song. Please check the server.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🎵 Song Recognition System</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleRecognize} disabled={!file}>Recognize Song</button>
      <p>{result}</p>

      <hr />

      <h2>Add a Song</h2>
      <input
        type="text"
        placeholder="Song Name"
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Artist Name"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
      />
      <button onClick={handleAddSong} disabled={!file || !songName || !artistName}>Add Song</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
