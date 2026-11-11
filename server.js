// 🔥 MASTER HACK: SSL Bypass (Certificate errors ko ignore karne ke liye)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https'); // Bypass ke liye naya module

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔥 Agent jo expired SSL certificate ko bypass karega
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Health Check
app.get('/', (req, res) => {
    res.send('SteroMax SSL Bypass Scraper is LIVE! 🚀');
});

// SECRET API CLONES (Delusionz ko No. 1 pe rakha hai kyunki wo zinda hai)
const API_INSTANCES = [
    "https://c.delusionz.xyz",                  
    "https://api.consumet.app",                 
    "https://consumet-api-clone.vercel.app",    
    "https://api-consumet.vercel.app"           
];

app.get('/api/get-video', async (req, res) => {
    try {
        const { title, ep } = req.query;
        console.log(`\n[SCRAPER] Target: ${title}, Episode: ${ep}`);

        let streamLink = "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"; 
        let success = false;

        if (title) {
            const cleanTitle = title.split(':')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            for (let baseUrl of API_INSTANCES) {
                if (success) break;

                try {
                    console.log(`➡️ Trying Server: ${baseUrl}`);
                    
                    // 🛡️ Yahan humne bypass wala httpsAgent laga diya
                    const searchRes = await axios.get(`${baseUrl}/anime/gogoanime/${cleanTitle}`, { 
                        timeout: 10000, 
                        httpsAgent 
                    });
                    
                    if (searchRes.data.results && searchRes.data.results.length > 0) {
                        const animeId = searchRes.data.results[0].id;
                        const epId = `${animeId}-episode-${ep}`;
                        
                        console.log(`✅ ID Mil Gayi: ${animeId}`);

                        const streamRes = await axios.get(`${baseUrl}/anime/gogoanime/watch/${epId}`, { 
                            timeout: 10000, 
                            httpsAgent 
                        });

                        if (streamRes.data.sources) {
                            const bestSource = streamRes.data.sources.find(s => s.quality === '1080p' || s.quality === 'default') || streamRes.data.sources[0];
                            streamLink = bestSource.url;
                            console.log(`🔥 ASLI LINK HACKED: ${streamLink}`);
                            success = true;
                        }
                    }
                } catch (scrapeError) {
                    console.error(`❌ Server Fail (${baseUrl}):`, scrapeError.message);
                }
            }
        }

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
    console.log(`SteroStream Bypass Engine RUNNING on PORT ${PORT}`);
});
