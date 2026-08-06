const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// 1. Ping & Network Info Route
app.get('/api/info', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({
        ip: clientIp,
        org: "TurboCenter High-Speed Node",
        city: "Cloud Edge",
        country_name: "Optimized"
    });
});

// 2. Real Download Speed Test Route (Serves a 25MB data chunk)
const DOWNLOAD_SIZE = 25 * 1024 * 1024; // 25 MB
const downloadBuffer = Buffer.alloc(DOWNLOAD_SIZE, 'x');

app.get('/api/download', (req, res) => {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', DOWNLOAD_SIZE);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.end(downloadBuffer);
});

// 3. Real Upload Speed Test Route (Receives data payload)
app.post('/api/upload', (req, res) => {
    let bytesReceived = 0;
    req.on('data', (chunk) => {
        bytesReceived += chunk.length;
    });
    req.on('end', () => {
        res.json({ status: 'success', bytesReceived });
    });
});

app.listen(PORT, () => {
    console.log(`TurboCenter live at http://localhost:${PORT}`);
});