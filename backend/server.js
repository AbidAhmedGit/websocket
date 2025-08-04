const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    // Broadcast to all clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`User: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Serve static files (for production)
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});