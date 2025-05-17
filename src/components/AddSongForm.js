import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

const AddSongForm = ({ darkMode }) => {
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        mood: '',
        link: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // YouTube ID extractor function
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Validate YouTube URL if it's a YouTube link
            if (formData.link.includes('youtube.com') || formData.link.includes('youtu.be')) {
                const videoId = getYouTubeId(formData.link);
                if (!videoId) {
                    throw new Error('Please enter a valid YouTube URL');
                }
            }

            const response = await axios.post('http://localhost:8080/api/songs', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                setSuccess(true);
                setFormData({
                    title: '',
                    artist: '',
                    mood: '',
                    link: ''
                });
                // Auto-hide success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error adding song:', error);
            setError(error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to add song. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Mood options for dropdown - only the specified moods
    const moodOptions = ['angry', 'calm', 'happy', 'sad', 'neutral'];

    return (
        <Container className={`py-5 ${darkMode ? 'text-light' : ''}`} style={{ maxWidth: '600px' }}>
            <div className="text-center mb-4">
                <h2>Add New Song</h2>
                <p className="text-muted">Fill the form to add a song to the database</p>
            </div>

            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                Song added successfully!
            </Alert>}

            <Form onSubmit={handleSubmit} className={`p-4 rounded ${darkMode ? 'bg-dark' : 'bg-light'}`}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Song title"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Artist</Form.Label>
                    <Form.Control
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleChange}
                        placeholder="Artist name"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Mood</Form.Label>
                    <Form.Select
                        name="mood"
                        value={formData.mood}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a mood</option>
                        {moodOptions.map((mood) => (
                            <option key={mood} value={mood}>
                                {mood.charAt(0).toUpperCase() + mood.slice(1)}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Music Link</Form.Label>
                    <Form.Control
                        type="url"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="YouTube, Spotify, or SoundCloud URL"
                        required
                    />
                    <Form.Text className="text-muted">
                        Please provide a valid music streaming link
                    </Form.Text>
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 py-2 mt-3"
                >
                    {loading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Adding Song...
                        </>
                    ) : 'Add Song'}
                </Button>
            </Form>
        </Container>
    );
};

export default AddSongForm;