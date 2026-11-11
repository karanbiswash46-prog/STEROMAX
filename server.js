const express = require('express');
const app = express();

// Render ke liye dynamic port aur local ke liye fallback 3000
const PORT = process.env.PORT || 3000;

// Middleware agar zaroorat ho
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route check karne ke liye
app.get('/', (req, res) => {
    res.send('SteroStream Backend is Live and Running!');
});

// Server listen on dynamic PORT
app.listen(PORT, () => {
    console.log(`SteroStream Backend Engine PORT ${PORT} par ZINDA hai!`);
});
