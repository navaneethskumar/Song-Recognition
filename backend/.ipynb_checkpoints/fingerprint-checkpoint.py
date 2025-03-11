import librosa
import numpy as np
import hashlib

def extract_fingerprint(audio_file):
    y, sr = librosa.load(audio_file, sr=None)
    spectrogram = np.abs(librosa.stft(y))  # Convert audio to spectrogram
    fingerprint = hashlib.sha256(spectrogram.tobytes()).hexdigest()  # Hash it
    return fingerprint
