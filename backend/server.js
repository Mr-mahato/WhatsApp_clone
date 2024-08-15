const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const clients = {}; // Store clients by ID
const qrCodes = {}; // Store QR codes by client ID

// Initialize the WhatsApp client
const initializeClient = async (clientId) => {
    const client = new Client({
        authStrategy: new LocalAuth({ clientId }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', async (qr) => {
        console.log(`QR code received for client ${clientId}:`, qr);
        try { 
            const qrCodeDataURL = await qrcode.toDataURL(qr);
            qrCodes[clientId] = qrCodeDataURL;
            console.log(`QR code generated and stored for client ${clientId}.`);
            console.log(`QR Code Data URL for client ${clientId}:`);
            console.log(qrCodeDataURL); // Output QR code data URL to console
        } catch (err) {
            console.error(`Error generating QR code for client ${clientId}:`, err);
        }
    });

    client.on('ready', () => {
        console.log(`Client ${clientId} is ready!`);
    });

    client.on('authenticated', () => {
        console.log(`Client ${clientId} is authenticated!`);
    });

    client.on('auth_failure', (msg) => {
        console.error(`Authentication failure for client ${clientId}:`, msg);
    });

    client.on('message', msg => {
        console.log(`Received message for client ${clientId}:`, msg.body);
        // Add logic here to handle received messages for this client
    });

    try {
        await client.initialize();
        console.log(`Client ${clientId} initialized successfully.`);
        clients[clientId] = client;
    } catch (err) {
        console.error(`Error initializing client ${clientId}:`, err);
    }
};

// Route to initialize a new client
app.post('/initialize-client/:id', async (req, res) => {
    const clientId = req.params.id;
    console.log(clientId)

    console.log(qrCodes)
    if (clients[clientId]) {
        return res.status(400).json({ success: false, error: `Client ${clientId} already initialized. `});
    }

    await initializeClient(clientId);
    res.json({ success: true, message: `Client ${clientId} initialization started. `});
});

// Route to retrieve the QR code for a specific client
app.get('/qr/:id', (req, res) => {
    const clientId = req.params.id;
    const qrCode = qrCodes[clientId];

    if (qrCode) {
        res.json({
            message: `Scan this QR code to authenticate client ${clientId}`,
            qrCode: qrCode
        });
    } else {
        res.status(503).json({ error: `QR code for client ${clientId} not yet generated. Please try again shortly.` });
    }
});

// Route to send a message from a specific client
app.post('/send-message/:id', async (req, res) => {
    const clientId = req.params.id;
    const { number, message } = req.body;

    const client = clients[clientId];
    if (!client) {
        return res.status(404).json({ success: false, error: `Client ${clientId} not found. `});
    }

    try {
        await client.sendMessage(`${number}@c.us`, message);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error(`Error sending message from client ${clientId}:`, error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});