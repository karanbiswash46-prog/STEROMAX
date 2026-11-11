process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// 🔥 JADUI RADAR FUNCTION: API ke JSON me ghus kar sirf .m3u8 link ko dhoondh nikalna
function findM3u8(obj) {
    let foundLink = null;
    function search(item) {
        if (foundLink) return; // Agar mil gaya toh baaki mat dhoondho
        if (typeof item === 'string' && item.includes('.m3u8') && item.startsWith('http')) {
            foundLink = item;
            return;
        }
        if (typeof item === 'object' && item !== null) {
            Object.values(item).forEach(search);
        }
    }
    search(obj);
    return foundLink;
}

app.get('/', (req, res) => res.send('SteroMax Ultimate M3U8 Hunter is LIVE! 🚀'));

app.get('/api/get-video', async (req, res) => {
    try {
        const { title, ep } = req.query;
        console.log(`\n[HUNTER ACTIVE] Target: ${title}, Episode: ${ep}`);

        let streamLink = "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"; 
        let success = false;

        if (title) {
            const cleanTitle = title.split(':')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            // RASTA 1: AMVSTR API (Dedicated Anime Scraper)
            if (!success) {
                try {
                    console.log(`➡️ Try 1: AMVSTR Anime API...`);
                    const search = await axios.get(`https://api.amvstr.me/api/v2/search?q=${cleanTitle}`, { timeout: 8000, httpsAgent });
                    
                    if (search.data.results && search.data.results.length > 0) {
                        const animeId = search.data.results[0].id;
                        const streamRes = await axios.get(`https://api.amvstr.me/api/v1/episode/${animeId}-episode-${ep}`, { timeout: 8000, httpsAgent });
                        
                        // Jadui radar se link nikalo
                        const magicLink = findM3u8(streamRes.data);
                        if (magicLink) {
                            streamLink = magicLink;
                            console.log(`🔥 AMVSTR SUCCESS (Link Chura Liya): ${streamLink}`);
                            success = true;
                        }
                    }
                } catch (e) { console.error(`❌ AMVSTR Fail:`, e.message); }
            }

            // RASTA 2: Zoro (AniWatch) API via Delusionz
            if (!success) {
                try {
                    console.log(`➡️ Try 2: Zoro (AniWatch) API...`);
                    const search = await axios.get(`https://c.delusionz.xyz/anime/zoro/${cleanTitle}`, { timeout: 8000, httpsAgent });
                    
                    if (search.data.results && search.data.results.length > 0) {
                        const animeId = search.data.results[0].id;
                        const infoRes = await axios.get(`https://c.delusionz.xyz/anime/zoro/info?id=${animeId}`, { timeout: 8000, httpsAgent });
                        
                        if (infoRes.data.episodes) {
                            const epData = infoRes.data.episodes.find(e => e.number === parseInt(ep));
                            if (epData) {
                                const streamRes = await axios.get(`https://c.delusionz.xyz/anime/zoro/watch?episodeId=${epData.id}`, { timeout: 8000, httpsAgent });
                                const magicLink = findM3u8(streamRes.data);
                                if (magicLink) {
                                    streamLink = magicLink;
                                    console.log(`🔥 ZORO SUCCESS (Link Chura Liya): ${streamLink}`);
                                    success = true;
                                }
                            }
                        }
                    }
                } catch (e) { console.error(`❌ Zoro Fail:`, e.message); }
            }
        }

        return res.json({ success: true, title, episode: ep, videoLink: streamLink });
    } catch (error) {
        console.error("Backend Crash:", error);
        return res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => console.log(`SteroStream Hunter Engine RUNNING on PORT ${PORT}`));
