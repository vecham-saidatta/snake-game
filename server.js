// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const HIGH_SCORE_FILE = path.join(__dirname, 'data', 'highscore.json');

// --- Middleware ---
// Serve static files from the 'public' directory
app.use(express.static('public'));
// Enable the express app to parse JSON formatted request bodies
app.use(express.json());


// --- API Routes ---

// GET route to fetch the high score
app.get('/api/highscore', (req, res) => {
    fs.readFile(HIGH_SCORE_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading high score' });
        }
        res.json(JSON.parse(data));
    });
});

// POST route to update the high score
app.post('/api/highscore', (req, res) => {
    const { score } = req.body;

    fs.readFile(HIGH_SCORE_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading high score' });
        }

        const currentData = JSON.parse(data);
        if (score > currentData.highScore) {
            currentData.highScore = score;
            fs.writeFile(HIGH_SCORE_FILE, JSON.stringify(currentData, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    return res.status(500).json({ message: 'Error writing high score' });
                }
                res.json(currentData);
            });
        } else {
            res.json(currentData); // Send back the old high score if not beaten
        }
    });
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});