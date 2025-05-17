import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config';

const WebcamMood = ({ setError, darkMode }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const captureAndAnalyze = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setApiError('No image captured!');
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      // Send the full data URL including the prefix
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE_FACE}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageSrc }), // Send complete data URL
        }
      );

      // First check if response is OK
      if (!response.ok) {
        // Try to parse error message
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.text();
          if (errorData) errorMsg = errorData;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMsg);
      }

      // If response is OK, parse JSON
      const data = await response.json();

      if (data.mood && data.song) {
        navigate('/mood-playlist', {
          state: {
            mood: data.mood,
            songs: [data.song]
          }
        });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error analyzing mood:', err);
      setApiError(err.message || 'Failed to analyze mood');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (keep all your imports and the captureAndAnalyze function the same)

  // ... (keep all your imports and the captureAndAnalyze function the same)

  return (
    <div className={`text-center p-3 ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
      <div className="d-flex flex-column align-items-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="80%"  // Reduced from 100% to 80%
          height="auto" // Let it scale naturally
          className="mb-3 rounded border border-2 border-primary"
          videoConstraints={{
            facingMode: "user",
            width: 640,  // Reduced from 1280
            height: 480  // Reduced from 720
          }}
          style={{
            maxWidth: '500px', // Limits maximum size
            margin: '0 auto'  // Centers horizontally
          }}
          screenshotQuality={0.8}
        />

        {apiError && (
          <Alert variant="danger" className="mb-3 w-75 mx-auto">
            {apiError.includes('Invalid image format')
              ? 'Please capture a clearer image'
              : apiError}
          </Alert>
        )}

        <div className="text-center mt-2">
          <Button
            onClick={captureAndAnalyze}
            disabled={loading}
            size="md" // Changed from lg to md
            variant={darkMode ? 'outline-light' : 'primary'}
            style={{ minWidth: '200px' }}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Analyzing...
              </>
            ) : 'Capture & Analyze'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebcamMood;