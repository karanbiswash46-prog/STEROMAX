const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic check route
app.get('/', (req, res) => {
    res.send('SteroStream Backend is Live and Running!');
});

// 1. Movies ke liye Route (TMDB ID ke sath)
app.get('/:id', (req, res) => {
    const { id } = req.params;
    
    // Official VidSrc embed format using TMDB ID for movies
    const streamingUrl = `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
    
    res.json({ 
        success: true, 
        type: 'movie',
        id, 
        url: streamingUrl 
    });
});

// 2. Anime / Series ke liye Route (ID, Season, Episode ke sath)
app.get('/:id/:season/:episode', (req, res) => {
    const { id, season, episode } = req.params;
    
    // Official VidSrc embed format using TMDB ID for TV Shows / Anime
    const streamingUrl = `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    
    res.json({ 
        success: true, 
        type: 'tv/anime',
        id, 
        season, 
        episode, 
        url: streamingUrl 
    });
});

app.listen(PORT, () => {
    console.log(`SteroStream Backend Engine PORT ${PORT} par ZINDA hai!`);
});
