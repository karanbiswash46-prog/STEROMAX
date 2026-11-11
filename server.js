const express = require('express');
const app = express();

// Render ke liye dynamic port aur local ke liye fallback 3000
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/', (req, res) => {
    res.send('SteroStream Backend is Live and Running!');
});

// 1. Movie Route: TMDB ID milte hi seedha video player par redirect karega
app.get('/:id', (req, res) => {
    const { id } = req.params;
    
    // Favicon ya doosre unnecessary requests ko handle karne ke liye check
    if (id === 'favicon.ico') return res.status(404).send();

    const streamingUrl = `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
    return res.redirect(streamingUrl);
});

// 2. Anime / TV Series Route: ID, Season, Episode milte hi seedha player par redirect karega
app.get('/:id/:season/:episode', (req, res) => {
    const { id, season, episode } = req.params;
    
    const streamingUrl = `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    return res.redirect(streamingUrl);
});

// Server listen on dynamic PORT
app.listen(PORT, () => {
    console.log(`SteroStream Backend Engine PORT ${PORT} par ZINDA hai!`);
});
