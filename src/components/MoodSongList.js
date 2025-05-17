import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam'; // Make sure to install the package: npm install react-webcam

const MoodPlaylist = () => {
    const [mood, setMood] = useState('');
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFaceDetected, setIsFaceDetected] = useState(false);
    const webcamRef = useRef(null);

    // Capture the image from webcam
    const captureAndAnalyzeFace = async () => {
        const imageSrc = webcamRef.current.getScreenshot();  // Capture image from webcam

        if (!imageSrc) {
            alert("No image captured!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/songs/analyze-face', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageSrc }), // Send image as base64 string
            });

            const data = await response.json();

            if (data && data.mood) {
                setMood(data.mood);  // Set the mood returned by backend
                setIsFaceDetected(true); // Mark that face was detected
                setSong(data.songs); // Set the song based on the detected mood
            } else {
                alert("No mood detected.");
            }
        } catch (error) {
            console.error('Error detecting mood from face:', error);
            alert("Error occurred while analyzing your face.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Mood-based Playlist</h1>

            {/* Webcam to capture image for mood analysis */}
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{
                    facingMode: "user",
                }}
            />

            {/* Button to capture image and analyze mood */}
            <button onClick={captureAndAnalyzeFace} disabled={loading}>
                {loading ? 'Detecting...' : 'Analyze Face Mood'}
            </button>

            {/* Show detected mood */}
            {isFaceDetected && <h2>Detected Mood: {mood}</h2>}

            {/* Show the song based on the detected mood */}
            {song && song.link && (
                <div>
                    <h2>{song.title} - {song.artist}</h2>
                    <audio controls autoPlay>
                        <source src={song.link} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
};

export default MoodPlaylist;
