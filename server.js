// server.js

const express = require('express');
const path = require('path');
const { kv } = require('@vercel/kv'); // Import the Vercel KV package

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(express.static('public'));
app.use(express.json());

// --- API Routes ---

// GET route to fetch the high score from Vercel KV
app.get('/api/highscore', async (req, res) => {
    try {
        // Retrieve the score from the key 'highscore'. If it doesn't exist, default to 0.
        const highScore = await kv.get('highscore') || 0;
        res.json({ highScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reading high score from KV store' });
    }
});

// POST route to update the high score in Vercel KV
app.post('/api/highscore', async (req, res) => {
    const { score } = req.body;

    try {
        // Get the current high score
        const currentHighScore = await kv.get('highscore') || 0;

        // Only update if the new score is higher
        if (score > currentHighScore) {
            await kv.set('highscore', score);
            return res.json({ highScore: score });
        }

        res.json({ highScore: currentHighScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error writing high score to KV store' });
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});