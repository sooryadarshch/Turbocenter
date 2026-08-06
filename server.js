const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from the same directory
app.use(express.static(__dirname));

// 1. Network & IP Information API Route
app.get('/api/info', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.json({
        ip: clientIp,
        org: "TurboCenter Global Node",
        city: "Local Region",
        country_name: "Optimized"
    });
});

// 2. Download Speed Test Route (Sends a 10MB data chunk)
const DOWNLOAD_SIZE = 10 * 1024 * 1024; // 10 Megabytes
const downloadBuffer = Buffer.alloc(DOWNLOAD_SIZE, 'a');

app.get('/api/download', (req, res) => {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', DOWNLOAD_SIZE);
    res.end(downloadBuffer);
});

// 3. Upload Speed Test Route (Receives data payload from the client)
app.post('/api/upload', (req, res) => {
    let bytesReceived = 0;

    req.on('data', (chunk) => {
        bytesReceived += chunk.length;
    });

    req.on('end', () => {
        res.json({ 
            status: 'success', 
            bytesReceived: bytesReceived 
        });
    });
});

// Start the TurboCenter Server
app.listen(PORT, () => {
    console.log(`TurboCenter server is running live at http://localhost:${PORT}`);
});