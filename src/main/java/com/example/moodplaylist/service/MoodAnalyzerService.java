package com.example.moodplaylist.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MoodAnalyzerService {

    private Map<String, String> moodMapping;

    public MoodAnalyzerService() {
        moodMapping = new HashMap<>();

        // Angry-related (FER label 0)
        moodMapping.put("angry", "angry");
        moodMapping.put("mad", "angry");
        moodMapping.put("furious", "angry");
        moodMapping.put("rage", "angry");
        moodMapping.put("irritated", "angry");
        moodMapping.put("annoyed", "angry");
        moodMapping.put("frustrated", "angry");
        moodMapping.put("fuming", "angry");
        moodMapping.put("agitated", "angry");

        // Disgust & Fear mapped to Calm (FER labels 1 and 2)
        moodMapping.put("disgust", "calm");
        moodMapping.put("grossed out", "calm");
        moodMapping.put("nauseated", "calm");
        moodMapping.put("repulsed", "calm");

        moodMapping.put("fear", "calm");
        moodMapping.put("scared", "calm");
        moodMapping.put("afraid", "calm");
        moodMapping.put("nervous", "calm");
        moodMapping.put("anxious", "calm");
        moodMapping.put("worried", "calm");
        moodMapping.put("tense", "calm");

        moodMapping.put("calm", "calm");
        moodMapping.put("peaceful", "calm");
        moodMapping.put("relaxed", "calm");
        moodMapping.put("serene", "calm");
        moodMapping.put("chill", "calm");
        moodMapping.put("laid-back", "calm");

        // Happy-related (FER label 3 and surprise → 5)
        moodMapping.put("happy", "happy");
        moodMapping.put("joy", "happy");
        moodMapping.put("excited", "happy");
        moodMapping.put("cheerful", "happy");
        moodMapping.put("delighted", "happy");
        moodMapping.put("elated", "happy");
        moodMapping.put("amused", "happy");
        moodMapping.put("smiling", "happy");
        moodMapping.put("surprised", "happy");
        moodMapping.put("shocked", "happy");
        moodMapping.put("stunned", "happy");

        // Sad-related (FER label 4)
        moodMapping.put("sad", "sad");
        moodMapping.put("down", "sad");
        moodMapping.put("depressed", "sad");
        moodMapping.put("unhappy", "sad");
        moodMapping.put("gloomy", "sad");
        moodMapping.put("melancholy", "sad");
        moodMapping.put("blue", "sad");
        moodMapping.put("tearful", "sad");
        moodMapping.put("crying", "sad");
        moodMapping.put("low", "sad");
        moodMapping.put("guilty", "sad");


        // Neutral-related (FER label 6)
        moodMapping.put("neutral", "neutral");
        moodMapping.put("fine", "neutral");
        moodMapping.put("okay", "neutral");
        moodMapping.put("meh", "neutral");
        moodMapping.put("blank", "neutral");
        moodMapping.put("normal", "neutral");
    }


    public String analyzeMood(String input) {
        String lowerInput = input.toLowerCase();

        for (String mood : moodMapping.keySet()) {
            if (lowerInput.contains(mood)) {
                return moodMapping.get(mood);
            }
        }
        return "neutral"; // default mood if no match is found
    }
}
