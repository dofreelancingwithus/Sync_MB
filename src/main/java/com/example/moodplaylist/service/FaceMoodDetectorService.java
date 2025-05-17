package com.example.moodplaylist.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Base64;

@Service
public class FaceMoodDetectorService {

    private final RestTemplate restTemplate;

    public FaceMoodDetectorService() {
        this.restTemplate = new RestTemplate();
    }

    public String detectMoodFromImage(byte[] imageBytes) throws Exception {
        // Convert image bytes to base64 string
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        // Prepare the request to send to the Python service
        String pythonServiceUrl = "http://localhost:5000/api/songs/analyze-face";  // Correct URL
        // Python Flask URL
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Construct the JSON body for the request
        String body = "{\"image\": \"" + base64Image + "\"}";

        // Set the HTTP entity with the body and headers
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            // Send the image to the Python backend (Flask) and get the response
            ResponseEntity<String> response = restTemplate.exchange(pythonServiceUrl, HttpMethod.POST, entity, String.class);

            // Return the detected mood from Python response
            return response.getBody();
        } catch (Exception e) {
            // Log error and throw exception for handling in the calling code
            System.err.println("Error during facial mood analysis: " + e.getMessage());
            throw new Exception("Failed to detect mood from image", e);
        }
    }
}
