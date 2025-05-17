# SYNC
<div align="center">
  <img src="https://sync-mb.vercel.app/assets/logo-dark.png" alt="Sync Banner" width="700">
</div>
A smart, AI-powered music recommendation system that generates personalized playlists based on your current mood—detected through either facial expressions or text input.

## 🌟 Features

- 🎭 Detect mood from facial expressions (via webcam)
- 💬 Detect mood from user-entered text
- 🎵 Recommend songs from a MySQL database based on detected mood
- 🚀 Integrated with Spring Boot (Java), Flask (Python), React.js, OpenCV, and Keras
- 📸 Webcam support for real-time facial mood detection
- 🎼 Autoplay song preview with smooth UI transitions
- 📊 Scalable architecture with clean separation of frontend and backend services

---

## 🤖 AI Model (Keras)
-Trained on facial emotion dataset (e.g., FER-2013)

-Detects emotions like happy, sad, angry, neutral

-Integrated with OpenCV for face detection



## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS (UI Styling)
- Webcam Capture (for facial mood detection)
- Axios (API requests)

### Backend
#### 1. **Java (Spring Boot)**
- CRUD operations for songs
- Mood-to-song mapping logic
- REST APIs to serve recommended songs

#### 2. **Python (Flask)**
- Receives base64 webcam image
- Detects face using OpenCV
- Predicts mood using Keras model
- Returns detected mood to Spring Boot service

### Database
- MySQL
  - Table: `song(id, title, mood, link)`

---

## 📂 Project Structure

```plaintext
mood-playlist/
├── backend/
│   ├── springboot/         # Java Spring Boot backend
│   └── flask/              # Flask server for facial mood detection
├── frontend/               # React-based frontend
└── database/               # SQL scripts for MySQL schema & data

# 🚀 Setup Instructions

### Backend - Spring Boot (Java)
```bash
cd backend/springboot
./mvnw spring-boot:run

cd backend/flask
pip install -r requirements.txt
python app.py

cd frontend
npm install
npm start

CREATE TABLE song (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  mood VARCHAR(100),
  link TEXT
);

-- Insert sample songs with mood tags like 'happy', 'sad', 'angry', 'calm'


