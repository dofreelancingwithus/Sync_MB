import React, { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG, DEFAULT_ERROR_MESSAGES } from '../config';

const TextMoodInput = ({ setError }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate minimum 3 characters
    if (!text.trim() || text.trim().length < 3) {
      setError('Please enter at least 3 characters to describe your mood');
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE_TEXT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: text }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        // Navigate to mood playlist with YouTube autoplay
        navigate('/mood-playlist', {
          state: {
            mood: data.mood,
            songs: [data],
            autoplay: true
          }
        });
      } else {
        setApiError(DEFAULT_ERROR_MESSAGES.NO_MOOD_DETECTED);
      }
    } catch (err) {
      console.error('Error analyzing text:', err);
      setApiError(err.message || DEFAULT_ERROR_MESSAGES.ANALYZE_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group className="mb-3">
        <Form.Label>Describe your mood (minimum 3 characters)</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          placeholder="I feel happy and energetic today..."
          style={{ minHeight: '150px' }}
          minLength={3}
          maxLength={500}
        />
      </Form.Group>
      {apiError && <Alert variant="danger" className="mb-3">{apiError}</Alert>}
      <Button
        type="submit"
        disabled={loading || text.trim().length < 3}
        size="lg"
      >
        {loading ? (
          <>
            <Spinner size="sm" animation="border" className="me-2" />
            Analyzing...
          </>
        ) : 'Analyze Mood'}
      </Button>
    </Form>
  );
};

export default TextMoodInput;