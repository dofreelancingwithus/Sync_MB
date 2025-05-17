package com.example.moodplaylist.controller;

import com.example.moodplaylist.dto.FaceImageRequest;
import com.example.moodplaylist.model.Song;
import com.example.moodplaylist.model.UserInput;
import com.example.moodplaylist.repository.SongRepository;
import com.example.moodplaylist.service.FaceMoodDetectorService;
import com.example.moodplaylist.service.MoodAnalyzerService;
import com.example.moodplaylist.service.SongService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin(origins = "http://localhost:3000")
public class SongController {

    private static final Logger logger = LoggerFactory.getLogger(SongController.class);

    @Autowired
    private MoodAnalyzerService moodAnalyzerService;

    @Autowired
    private FaceMoodDetectorService faceMoodDetectorService;

    @Autowired
    private SongRepository songRepository;

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @PostMapping
    public ResponseEntity<String> addSong(@RequestBody Song song) {
        try {
            if (song.getTitle() == null || song.getArtist() == null || song.getMood() == null || song.getLink() == null) {
                return ResponseEntity.badRequest().body("All fields are required");
            }
            songRepository.save(song);
            return ResponseEntity.status(HttpStatus.CREATED).body("Song added successfully");
        } catch (Exception e) {
            logger.error("Error adding song: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding song: " + e.getMessage());
        }
    }

    @GetMapping("/{mood}")
    public ResponseEntity<Song> getSongByMood(@PathVariable String mood) {
        Song song = songService.getRandomSongByMood(mood);
        if (song == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(song);
    }

    @PostMapping("/analyze-face")
    public ResponseEntity<?> analyzeMoodFromFace(@RequestBody FaceImageRequest request) {
        try {
            if (request.getImage() == null || !request.getImage().contains(",")) {
                return ResponseEntity.badRequest().body("Invalid image format");
            }

            String base64Image = request.getImage().split(",")[1];
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            String rawExpression = faceMoodDetectorService.detectMoodFromImage(imageBytes);
            String mood = moodAnalyzerService.analyzeMood(rawExpression);
            Song song = songService.getRandomSongByMood(mood);

            if (song == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No song found for mood: " + mood);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("mood", mood);
            result.put("song", song);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logger.error("Error analyzing image: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error analyzing image: " + e.getMessage());
        }
    }

    @PostMapping("/facial-mood")
    public ResponseEntity<Song> getSongByFacialMood(@RequestBody UserInput userInput) {
        try {
            String mood = userInput.getMessage().toLowerCase();
            Song song = songService.getRandomSongByMood(mood);
            if (song == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(song);
        } catch (Exception e) {
            logger.error("Error fetching song by facial mood: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/facial-mood")
    public ResponseEntity<Song> getSongByFacialMoodFromQuery(@RequestParam String mood) {
        try {
            Song song = songService.getRandomSongByMood(mood.toLowerCase());
            if (song == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(song);
        } catch (Exception e) {
            logger.error("Error fetching song by facial mood from query: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Song>> getAllSongs() {
        return ResponseEntity.ok(songRepository.findAll());
    }

    @PostMapping("/analyze")
    public ResponseEntity<Song> analyzeAndSendSong(@RequestBody UserInput userInput) {
        try {
            String mood = moodAnalyzerService.analyzeMood(userInput.getMessage());
            Song song = songService.getRandomSongByMood(mood);
            if (song == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(song);
        } catch (Exception e) {
            logger.error("Error analyzing text input: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
