import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav, Spinner, Button } from 'react-bootstrap';
import './App.css';
import ScrollToTop from './components/ScrollToTop';

const WelcomeScreen = lazy(() => import('./components/WelcomeScreen'));
const MoodDetection = lazy(() => import('./pages/MoodDetection'));
const WebcamMood = lazy(() => import('./components/WebcamMood'));
const MoodPlaylist = lazy(() => import('./components/MoodPlaylist'));
const TextMoodInput = lazy(() => import('./components/TextMoodInput'));
const Admin = lazy(() => import('./pages/Admin'));
const AddSongForm = lazy(() => import('./components/AddSongForm'));
const SongList = lazy(() => import('./components/SongList'));

function App() {
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    setUserName('');
  };

  if (userName) {
    return (
      <Router>
        <ScrollToTop />
        <div className={`app-container ${darkMode ? "dark-theme" : "light-theme"}`}>
          <Navbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} expand="lg">
            <Container>
              <Navbar.Brand as={Link} to="/mood-detection" className="d-flex align-items-center">
                <img
                  src={darkMode ? "/assets/logo-light.png" : "/assets/logo-dark.png"}
                  height="40"
                  alt="MoodTunes"
                  className="me-2 logo-img"
                />
                <span className={darkMode ? 'text-white' : 'text-dark'}>MoodTunes</span>
              </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse>
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/mood-detection">Home</Nav.Link>
                  <Nav.Link as={Link} to="/songs">Music Library</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                  <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                    Logout
                  </Button>
                  <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle ms-2">
                    {darkMode ? "☀️" : "🌙"}
                  </button>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <main>
            <Suspense fallback={<div className="loading-spinner"><Spinner animation="border" /></div>}>
              <Container>
                {error && <div className="error-message">{error}</div>}
                <Routes>
                  <Route path="/" element={<Navigate to="/mood-detection" />} />
                  <Route path="/mood-detection" element={<MoodDetection setError={setError} darkMode={darkMode} userName={userName} />} />
                  <Route path="/camera-input" element={<WebcamMood setError={setError} darkMode={darkMode} />} />
                  <Route path="/text-input" element={<TextMoodInput setError={setError} darkMode={darkMode} />} />
                  <Route path="/mood-playlist" element={<MoodPlaylist setError={setError} darkMode={darkMode} />} />
                  <Route path="/songs" element={<SongList setError={setError} darkMode={darkMode} />} />
                  <Route path="/admin" element={<Admin setError={setError} darkMode={darkMode} />} />
                  <Route path="/admin/add-song" element={<AddSongForm setError={setError} darkMode={darkMode} />} />
                  <Route path="*" element={<Navigate to="/mood-detection" />} />
                </Routes>
              </Container>
            </Suspense>
          </main>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className={`app-container ${darkMode ? "dark-theme" : "light-theme"}`}>
        <Suspense fallback={<div className="loading-spinner"><Spinner animation="border" /></div>}>
          <Routes>
            <Route path="/" element={<WelcomeScreen darkMode={darkMode} setUserName={setUserName} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
