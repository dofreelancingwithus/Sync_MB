import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import './MoodDetection.css';

const MoodDetection = ({ setError, darkMode }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Friend';

  const moodData = [
    { id: 0, name: 'angry', emoji: '😠', color: '#ff4d4d' },
    { id: 1, name: 'calm', emoji: '😌', color: '#4da6ff' },
    { id: 3, name: 'happy', emoji: '😊', color: '#ffcc4d' },
    { id: 4, name: 'sad', emoji: '😢', color: '#9999ff' },
    { id: 6, name: 'neutral', emoji: '😐', color: '#cccccc' }
  ];

  return (
    <Container className={`mood-options-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Greeting at the top left */}
      <div className={`greeting-container ${darkMode ? 'text-white' : 'text-dark'}`}>
        <h2 className="greeting-text">
          Hello, <span className="user-name">{userName}</span>
        </h2>
      </div>

      {/* Centered Sync title and content */}
      <div className={`welcome-section ${darkMode ? 'text-white' : 'text-dark'}`}>
        <h1 className="app-name">Sync</h1>
        <h2 className="app-tagline">Your Mood Music Generator</h2>
        <p className="app-description">
          Express your mood and discover your perfect soundtrack
        </p>

        <div className="mood-blocks-container">
          {moodData.map((mood) => (
            <div
              key={mood.id}
              className="mood-block"
              data-mood={mood.name}
              style={{ '--mood-color': mood.color }}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-name">{mood.name}</span>
            </div>
          ))}
        </div>

        <div className="quote-box">
          <p>"Music is the shorthand of emotion." — Leo Tolstoy</p>
        </div>
      </div>

      {/* Input options - made more compact */}
      <div className="input-options-container">
        <h3 className={`options-title ${darkMode ? 'text-white' : 'text-dark'}`}>
          How would you like to share your mood?
        </h3>

        <div className="options-wrapper">
          <Card
            className={`option-card ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}
            onClick={() => navigate('/camera-input')}
          >
            <Card.Body className="option-content">
              <div className="option-icon">📷</div>
              <h3 className="option-title">Use Camera</h3>
              <p className="option-description">Detect mood from facial expression</p>
            </Card.Body>
          </Card>

          <Card
            className={`option-card ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}
            onClick={() => navigate('/text-input')}
          >
            <Card.Body className="option-content">
              <div className="option-icon">✏️</div>
              <h3 className="option-title">Text Input</h3>
              <p className="option-description">Describe your mood in words</p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default MoodDetection;