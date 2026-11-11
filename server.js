const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Ye package doosri sites se link churane ke kaam aayega

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.send('SteroMax Advanced Anime Scraper is LIVE! 🚀');
});

// 🔥 Main Scraping API
app.get('/api/get-video', async (req, res) => {
    try {
        const { title, ep } = req.query;
        console.log(`[SCRAPER ACTIVE] Target: ${title}, Episode: ${ep}`);

        // Default test link (agar scraping fail ho jaye toh player khali na rahe)
        let streamLink = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"; 

        if (title) {
            // 1. Title ko clean karna (e.g., "Demon Slayer: Kimetsu no Yaiba" -> "demon slayer")
            const cleanTitle = title.split(':')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            try {
                console.log(`Searching API for: ${cleanTitle}`);
                // 2. Gogoanime par anime search karna (via Consumet Open API)
                // Note: Agar 'api.consumet.org' down ho, toh URL change karna padh sakta hai
                const searchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/${cleanTitle}`);
                
                if (searchRes.data.results && searchRes.data.results.length > 0) {
                    const animeId = searchRes.data.results[0].id; // Asli ID mil gayi
                    console.log(`Anime ID Found: ${animeId}`);

                    // 3. Episode ka link nikalna
                    const epId = `${animeId}-episode-${ep}`;
                    const streamRes = await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${epId}`);

                    // 4. Sabse best quality (.m3u8) dhundhna
                    if (streamRes.data.sources) {
                        const bestSource = streamRes.data.sources.find(s => s.quality === '1080p' || s.quality === 'default') || streamRes.data.sources[0];
                        streamLink = bestSource.url; // 🔥 Asli link mil gaya!
                        console.log("🔥 CHURAYA HUA ASLI LINK:", streamLink);
                    }
                }
            } catch (scrapeError) {
                console.log("Scraping API me dikkat aayi. Fallback video load ho raha hai.");
            }
        }

        // Player ko JSON format me link return kar do
        return res.json({
            success: true,
            title: title || "SteroMax Anime",
            episode: ep || "1",
            videoLink: streamLink
        });

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ success: false, error: "Server Crash" });
    }
});

app.listen(PORT, () => {
    console.log(`SteroStream Scraper Engine is RUNNING on PORT ${PORT}`);
});
