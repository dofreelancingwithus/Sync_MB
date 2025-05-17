package com.example.moodplaylist.service;

import com.example.moodplaylist.model.Song;
import com.example.moodplaylist.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final Random random = new Random();

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public Song addSong(Song song) {
        return songRepository.save(song);
    }

    public Song getRandomSongByMood(String mood) {
        List<Song> songs = songRepository.findByMood(mood);
        if (songs.isEmpty()) return null;
        return songs.get(random.nextInt(songs.size()));
    }
}
