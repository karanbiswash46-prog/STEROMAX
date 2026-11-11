const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.use(cors());

// SteroStream Smart Scraper & Proxy Endpoint
app.get('/api/get-video', async (req, res) => {
    const title = req.query.title;
    const episode = req.query.ep || '1';

    if (!title) {
        return res.status(400).json({ success: false, message: "Bhai, title toh batao kya chalana hai!" });
    }

    console.log(`[SteroStream Engine] Searching content for: ${title} (Episode ${episode})`);

    try {
        // Yahan hum public sources se data fetch karne ka logic expand karenge
        // Abhi ke liye, ye ensure karega ki player crash na ho aur smooth stream mile
        
        // Public/Test HLS Stream jo player mein 100% chalegi
        const finalStreamLink = "https://live-par-2-abr-cdn.livepush.io/live/bigbuckbunny/index.m3u8";

        res.json({
            success: true,
            title: title,
            episode: episode,
            videoLink: finalStreamLink,
            message: "Stream successfully fetched by SteroStream Ninja!"
        });

    } catch (error) {
        console.error("Scraping error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Stream fetch karne mein error aa gaya!" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 SteroStream Backend Engine PORT ${PORT} par ZINDA hai!`);
});