const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.send('SteroMax Master Scraper is LIVE! 🚀 (Bypassing 451 Errors)');
});

// 🔥 SECRET API CLONES (Agar ek block hua, toh doosra chalega)
const API_INSTANCES = [
    "https://api.consumet.app",                 // Clone 1
    "https://consumet-api-clone.vercel.app",    // Clone 2
    "https://c.delusionz.xyz",                  // Clone 3
    "https://api-consumet.vercel.app"           // Clone 4
];

app.get('/api/get-video', async (req, res) => {
    try {
        const { title, ep } = req.query;
        console.log(`\n[MASTER SCRAPER ACTIVE] Target: ${title}, Episode: ${ep}`);

        // Default Fallback
        let streamLink = "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"; 
        let success = false;

        if (title) {
            const cleanTitle = title.split(':')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            // 🔥 LOOP START: Ek fail hoga toh doosra try karega
            for (let baseUrl of API_INSTANCES) {
                if (success) break; // Agar link mil gaya toh loop rok do

                try {
                    console.log(`➡️ Try kar rahe hain Server: ${baseUrl}`);
                    
                    // Search (timeout 8 seconds taaki server hang na ho)
                    const searchRes = await axios.get(`${baseUrl}/anime/gogoanime/${cleanTitle}`, { timeout: 8000 });
                    
                    if (searchRes.data.results && searchRes.data.results.length > 0) {
                        const animeId = searchRes.data.results[0].id;
                        const epId = `${animeId}-episode-${ep}`;
                        
                        console.log(`✅ ID Mil Gayi (${animeId}), Ab link nikal rahe hain...`);

                        // Extract Link
                        const streamRes = await axios.get(`${baseUrl}/anime/gogoanime/watch/${epId}`, { timeout: 8000 });

                        if (streamRes.data.sources) {
                            const bestSource = streamRes.data.sources.find(s => s.quality === '1080p' || s.quality === 'default') || streamRes.data.sources[0];
                            streamLink = bestSource.url;
                            console.log(`🔥 SUCCESS! ASLI LINK MIL GAYA: ${streamLink}`);
                            success = true; // Flag true kar do taaki aur API check na kare
                        }
                    }
                } catch (scrapeError) {
                    console.error(`❌ Server Fail (${baseUrl}):`, scrapeError.message);
                    console.log("🔄 Koi baat nahi, next server try kar rahe hain...");
                }
            }

            if (!success) {
                console.log("⚠️ Saare secret servers fail ho gaye. Fallback video load ho rahi hai.");
            }
        }

        // Return Data to VIP Player
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
    console.log(`SteroStream Master Engine RUNNING on PORT ${PORT}`);
});
