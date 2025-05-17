mood-playlist-app/                         # Root of the entire project
├── mood-playlist-frontend/                # React Frontend
│   ├── public/                            # Static files (HTML, favicon)
│   └── src/
│       ├── components/
│       │   ├── AddSongForm.js             # Admin form to add songs
│       │   ├── MoodInputSelector.js       # UI for mood input options
│       │   ├── MoodPlaylist.js            # Playlist display component
│       │   ├── WebcamMood.js              # Webcam-based mood detection
│       │   └── TextMoodInput.js           # Manual mood input
│       ├── pages/
│       │   ├── Admin.js                   # Admin dashboard
│       │   └── MoodDetection.js           # Main mood detection page
│       ├── App.js                         # Root React component
│       └── index.js                       # Entry point
|
├── python/                                # Flask-based facial mood detection backend
│   ├── models/
│   │   └── fer2013_mini_XCEPTION.102-0    # Pre-trained emotion detection model
│   ├── uploads/                           # Temporary image uploads
│   ├── venv/                              # Python virtual environment
│   ├── app.py                             # Flask server for mood analysis
│   ├── requirements.txt                   # Python dependencies
│   ├── songs.csv                          # Song dataset (mood mappings)
│   └── upload_excel_to_db.py              # Utility to load songs into DB
|
└── moodplaylist/                          # Java Spring Boot backend (core API + database)
    ├── .mvn/
    ├── src/
    │   ├── main/
    │   │   ├── java/com/example/moodplayli/
    │   │   │   ├── controller/
    │   │   │   │   └── SongController.java     # API endpoints
    │   │   │   ├── dto/
    │   │   │   │   └── FaceImageRequest.java   # Data transfer objects
    │   │   │   ├── model/
    │   │   │   │   ├── Song.java               # Song entity
    │   │   │   │   └── UserInput.java          # User input model
    │   │   │   ├── repository/
    │   │   │   │   └── SongRepository.java     # Database operations
    │   │   │   ├── service/
    │   │   │   │   ├── FaceMoodDetector.java   # Mood detection logic
    │   │   │   │   ├── MoodAnalyzerServer.java # Mood analysis service
    │   │   │   │   └── SongService.java        # Playlist generation logic
    │   │   │   └── MoodplaylistApplication.java# Main Spring Boot app
    │   │   └── resources/
    │   │       ├── static/                     # Frontend assets (if any)
    │   │       ├── templates/                  # Server-side templates
    │   │       └── application.properties      # Configurations
    │   └── test/                               # Unit tests
    └── target/                                 # Compiled binaries
