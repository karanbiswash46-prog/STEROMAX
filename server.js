const express = require('express');
const app = express();

// Render ke liye dynamic port aur local ke liye fallback 3000
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route check karne ke liye
app.get('/', (req, res) => {
    res.send('SteroStream Backend is Live and Running!');
});

// Route for movies or single ID requests
app.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ 
        success: true, 
        message: 'Backend received ID request successfully!', 
        id 
    });
});

// Route for series/anime with ID, Season, and Episode
app.get('/:id/:season/:episode', (req, res) => {
    const { id, season, episode } = req.params;
    res.json({ 
        success: true, 
        message: 'Backend received streaming request successfully!', 
        id, 
        season, 
        episode 
    });
});

// Server listen on dynamic PORT
app.listen(PORT, () => {
    console.log(`SteroStream Backend Engine PORT ${PORT} par ZINDA hai!`);
});
