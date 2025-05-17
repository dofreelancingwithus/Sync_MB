import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './WelcomeScreen.css';

const WelcomeScreen = ({ darkMode, setUserName }) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name);
      setUserName(name);
      navigate('/mood-detection', { replace: true });
    }
  };

  return (
    <Container className={`welcome-screen ${darkMode ? 'dark' : 'light'} d-flex align-items-center justify-content-center vh-100`}>
      <motion.div
        className="welcome-content text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="logo-wrapper mb-4"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Image
            src={darkMode ? "/assets/logo-light.png" : "/assets/logo-dark.png"}
            alt="Sync Logo"
            className="app-logo rounded-circle shadow-lg"
            fluid
          />
        </motion.div>

        <motion.h1
          className="company-name display-4 fw-bold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Sync
        </motion.h1>

        <motion.p
          className="company-tagline fs-4 fst-italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Feel it. Sync it. <span className="play-it">Play it.</span>
        </motion.p>

        <Form onSubmit={handleSubmit} className="name-form mt-4">
          <Form.Group controlId="formName">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="What's your name?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="name-input mb-3 p-3 rounded shadow-sm"
                required
              />
            </motion.div>
          </Form.Group>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Button variant="primary" type="submit" className="start-btn px-4 py-2 fw-semibold rounded-pill">
              Let's Begin
            </Button>
          </motion.div>
        </Form>
      </motion.div>
    </Container>
  );
};

export default WelcomeScreen;