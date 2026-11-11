const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('SteroStream Backend is Live and Running!');
});

// 1. Movie Route (Using vidsrc.to for faster response)
app.get('/:id', (req, res) => {
    const { id } = req.params;
    if (id === 'favicon.ico') return res.status(404).send();

    const streamingUrl = `https://vidsrc.to/embed/movie/${id}`;
    return res.redirect(streamingUrl);
});

// 2. Anime / TV Series Route (Using vidsrc.to for faster response)
app.get('/:id/:season/:episode', (req, res) => {
    const { id, season, episode } = req.params;
    
    const streamingUrl = `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
    return res.redirect(streamingUrl);
});

app.listen(PORT, () => {
    console.log(`SteroStream Backend Engine PORT ${PORT} par ZINDA hai!`);
});
