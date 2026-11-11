const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS taaki Firebase frontend player is backend se connect ho sake
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
    res.send('SteroMax Stream Scraper Backend is LIVE!');
});

// 🔥 Main API Endpoint jo frontend player call kar raha hai
app.get('/api/get-video', async (req, res) => {
    try {
        const { title, ep } = req.query;
        
        console.log(`[REQUEST RECEIVED] Title: ${title}, Episode: ${ep}`);

        // Yahan tu apna working HLS (.m3u8) stream link ya video source de sakta hai
        // Filhal ke liye ek test working stream link set hai
        let streamLink = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

        // Agar tu specific title ke hisab se link map karna chahe toh kar sakta hai
        if (title && title.toLowerCase().includes('naruto')) {
            streamLink = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"; // Naruto stream mapping
        }

        return res.json({
            success: true,
            title: title || "SteroMax Media",
            episode: ep || "1",
            videoLink: streamLink
        });

    } catch (error) {
        console.error("Error fetching stream:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`SteroStream Server running on port ${PORT}`);
});
