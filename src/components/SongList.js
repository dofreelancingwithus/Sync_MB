import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { MOOD_COLORS } from '../config';

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/songs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSongs(data);
        setFilteredSongs(data);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.length < 3) {
      setError('Please enter at least 3 characters to search');
      return;
    }
    const filtered = songs.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.mood.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(filtered);
    setError(filtered.length === 0 ? 'No songs match your search' : '');
  };

  const playSong = (song) => {
    setSelectedSong(song);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const videoId = url.includes('youtu.be/')
      ? url.split('youtu.be/')[1]
      : url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <h2 className="text-primary">Song Library</h2>
        <p className="text-muted">Browse all available songs in our database</p>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, artist or mood (min 3 chars)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setError('');
              }}
              minLength={3}
            />
            <Button variant="primary" type="submit">
              Search
            </Button>
          </div>
        </form>
      </div>

      {selectedSong && (
        <div className="mb-4">
          <div className="ratio ratio-16x9">
            <iframe
              src={getYouTubeEmbedUrl(selectedSong.link)}
              title={selectedSong.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <h4 className="mt-2">{selectedSong.title} - {selectedSong.artist}</h4>
          <Badge bg={MOOD_COLORS[selectedSong.mood.toLowerCase()] || 'secondary'}>
            {selectedSong.mood}
          </Badge>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="bg-light">
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Mood</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.map((song) => (
                <tr key={song.id}>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>
                    <Badge bg={MOOD_COLORS[song.mood.toLowerCase()] || 'secondary'}>
                      {song.mood}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => playSong(song)}
                    >
                      Play
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredSongs.length === 0 && !loading && (
            <Alert variant="info" className="text-center">
              No songs found in the database.
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default SongList;