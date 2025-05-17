import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { MOOD_EMOJIS } from '../config';

const MoodPlaylist = ({ darkMode }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [player, setPlayer] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = () => {
      console.error('Failed to load YouTube API');
      setLoading(false);
    };

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => setApiReady(true);

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  // Initialize player
  useEffect(() => {
    if (!apiReady || !state?.songs?.length) return;

    const videoId = getYouTubeId(state.songs[0].link);
    if (!videoId) {
      setLoading(false);
      return;
    }

    const newPlayer = new window.YT.Player('youtube-player', {
      videoId,
      playerVars: {
        origin: window.location.origin,
        autoplay: 1,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: (event) => {
          try {
            event.target.playVideo();
            setLoading(false);
          } catch (error) {
            setNeedsInteraction(true);
            setLoading(false);
          }
        },
        onError: () => {
          setNeedsInteraction(true);
          setLoading(false);
        }
      }
    });

    setPlayer(newPlayer);

    return () => {
      if (newPlayer) newPlayer.destroy();
    };
  }, [apiReady, state?.songs]);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (!state?.mood || !state?.songs || state.songs.length === 0) {
    return (
      <Container className={`text-center py-5 ${darkMode ? 'text-white' : ''}`}>
        <Alert variant="danger">
          No mood data found. Please try again.
        </Alert>
        <Button
          onClick={() => navigate('/mood-detection')}
          variant={darkMode ? 'outline-light' : 'primary'}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const { mood, songs } = state;
  const song = songs[0];

  return (
    <Container className={`py-4 ${darkMode ? 'text-white' : ''}`}>
      <Card className={`mb-4 ${darkMode ? 'bg-dark text-white' : ''}`}>
        <Card.Body className="text-center">
          <h2>
            Your Mood: <Badge bg="primary">{mood} {MOOD_EMOJIS[mood.toLowerCase()] || ''}</Badge>
          </h2>
          <p className={`${darkMode ? 'text-light' : 'text-muted'}`}>
            Here's a song that matches your mood
          </p>
        </Card.Body>
      </Card>

      <div className="ratio ratio-16x9 mb-4 position-relative">
        {loading && (
          <div className={`position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ${darkMode ? 'bg-dark' : 'bg-light'}`}>
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        <div id="youtube-player" />
        {needsInteraction && (
          <div
            className={`position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ${darkMode ? 'bg-dark bg-opacity-75' : 'bg-light bg-opacity-75'}`}
            onClick={() => {
              player?.playVideo();
              setNeedsInteraction(false);
            }}
          >
            <Button variant="primary" size="lg">
              ▶️ Click to Play
            </Button>
          </div>
        )}
      </div>

      <Card className={darkMode ? 'bg-dark text-white' : ''}>
        <Card.Body>
          <Card.Title>{song.title}</Card.Title>
          <Card.Subtitle className={`mb-2 ${darkMode ? 'text-light' : 'text-muted'}`}>
            {song.artist}
          </Card.Subtitle>
          <div className="d-flex gap-2">
            <Badge bg="secondary">{song.mood}</Badge>
            {song.genre && <Badge bg="info">{song.genre}</Badge>}
          </div>
        </Card.Body>
      </Card>

      <div className="text-center mt-4">
        <Button
          onClick={() => navigate('/mood-detection')}
          variant={darkMode ? 'outline-light' : 'outline-primary'}
          size="lg"
          className="me-3"
        >
          Try Again
        </Button>
        <Button
          onClick={() => navigate('/songs')}
          variant="primary"
          size="lg"
        >
          Browse All Songs
        </Button>
      </div>
    </Container>
  );
};

export default MoodPlaylist;